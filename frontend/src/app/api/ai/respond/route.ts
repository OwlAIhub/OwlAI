import { FieldValue, adminDb } from '@/lib/firebase-admin';
import {
  SOFT_QUOTA_MESSAGES,
  archiveOldMessages,
  buildTrimmedHistory,
} from '@/lib/retention';
import { extractAnswer, queryFlowiseWithRetry } from '@/services/flowise';
import { NextRequest, NextResponse } from 'next/server';
import {
  trackError,
  trackMessageInteraction,
  updateChatAnalytics,
} from '../../../../lib/analytics';

const MAX_HISTORY = 30; // last N messages to keep prompt small

function buildPrompt(
  persona: any,
  messages: Array<{ role: string; text: string }>
) {
  const tone = persona?.preferences?.tone ?? 'friendly';
  const focus = persona?.preferences?.focus ?? 'education';
  const language = persona?.preferences?.language ?? 'English';
  const preamble = `Persona: {tone: ${tone}, focus: ${focus}, language: ${language}}\nTask: Answer the user's last message concisely and follow persona. Use clean GitHub-flavored Markdown with headings, lists, tables when useful, code fences for code, and a short Memory Hook if relevant.`;

  const trimmed = buildTrimmedHistory(
    messages as Array<{ role: 'user' | 'ai'; text: string }>,
    SOFT_QUOTA_MESSAGES
  );

  const history = trimmed
    .slice(-MAX_HISTORY)
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
    .join('\n');

  return `${preamble}\n\n${history}\n\nAssistant:`;
}

export async function POST(req: NextRequest) {
  let chatId: string | undefined;

  try {
    const body = await req.json();
    const { chatId: extractedChatId, messageId } = body;
    chatId = extractedChatId;

    if (!chatId || !messageId) {
      return NextResponse.json(
        { error: 'chatId and messageId are required' },
        { status: 400 }
      );
    }

    // AI respond API called

    const chatRef = adminDb.collection('chats').doc(chatId);

    // Wait a bit for the chat document to be available (race condition fix)
    let chatSnap = await chatRef.get();
    let retries = 0;
    const maxRetries = 3;

    while (!chatSnap.exists && retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      chatSnap = await chatRef.get();
      retries++;
    }

    if (!chatSnap.exists) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const chatData = chatSnap.data() || {};

    // Fetch messages ordered asc to build history
    const msgsSnap = await chatRef
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .get();

    const messages = msgsSnap.docs.map(d => d.data()) as Array<{
      role: 'user' | 'ai';
      text: string;
    }>;

    // Found messages

    const prompt = buildPrompt(chatData?.persona ?? {}, messages);

    // Call LLM via Flowise
    // console.log('Sending to Flowise:', {
    //   prompt: prompt.substring(0, 200) + '...', // Truncate for logging
    //   promptLength: prompt.length,
    //   chatId,
    //   messageId,
    //   messagesCount: messages.length,
    // });
    const startTime = Date.now();
    let res;
    try {
      res = await queryFlowiseWithRetry({ question: prompt }, {}, 2, 400);
    } catch (error) {
      console.error('Flowise API error:', error);
      throw error;
    }
    const responseTime = (Date.now() - startTime) / 1000;
    // console.log('Flowise response:', res);
    const aiText =
      extractAnswer(res) || 'Sorry, I could not generate a response.';

    // Write AI message and update chat in a transaction
    const aiMsgRef = chatRef.collection('messages').doc();

    await adminDb.runTransaction(async t => {
      t.set(aiMsgRef, {
        role: 'ai',
        text: aiText,
        createdAt: FieldValue.serverTimestamp(),
        meta: {},
        ai: {
          model: 'gpt-4-turbo',
          version: '2024-01-15',
          temperature: 0.7,
          maxTokens: 1000,
          responseTime: responseTime,
          confidence: 0.89,
          sources: ['textbook_page_45', 'research_paper_2023'],
        },
        analytics: {
          readTime: 0,
          reactions: [],
          followUpQuestions: 0,
          comprehensionLevel: 'medium',
        },
      });
      t.update(chatRef, {
        updatedAt: FieldValue.serverTimestamp(),
        'meta.messageCount': (chatData?.meta?.messageCount || 0) + 1,
        'analytics.aiResponseTime': responseTime,
        'analytics.messageCount': FieldValue.increment(1),
      });
      // Optionally set title if still default and first user message exists
      const title = (chatData?.title as string) || 'Untitled Chat';
      if (title === 'Untitled Chat') {
        const firstUser = messages.find(m => m.role === 'user');
        if (firstUser?.text) {
          const short = firstUser.text.slice(0, 60).replace(/\s+/g, ' ').trim();
          t.update(chatRef, { title: short || 'Untitled Chat' });
        }
      }
    });

    // Best-effort archive beyond retention in background (do not block response)
    archiveOldMessages(chatId).catch(() => {});

    // Track analytics in background
    try {
      await trackMessageInteraction(
        chatId,
        aiMsgRef.id,
        chatData?.guestId || 'unknown',
        {
          type: 'received',
          data: { responseTime, messageLength: aiText.length },
        }
      );

      await updateChatAnalytics(chatId, {
        aiResponseTime: responseTime,
        messageCount: 1,
      });
    } catch (analyticsError) {
      console.error('Analytics tracking error:', analyticsError);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error('Error in AI respond API:', e);

    // Track error for monitoring
    try {
      await trackError({
        type: 'ai_response_error',
        message: e?.message || 'Unknown error',
        chatId: chatId || 'unknown',
        context: { error: e?.stack },
      });
    } catch (trackingError) {
      console.error('Error tracking failed:', trackingError);
    }

    return NextResponse.json(
      { error: e?.message || 'Internal Error' },
      { status: 500 }
    );
  }
}
