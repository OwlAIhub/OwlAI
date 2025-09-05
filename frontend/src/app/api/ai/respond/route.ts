import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Simple GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'AI API is running',
    timestamp: new Date().toISOString(),
  });
}

const MAX_HISTORY = 30; // last N messages to keep prompt small

async function buildPrompt(
  persona: Record<string, unknown>,
  messages: Array<{ role: string; text: string }>
) {
  const preferences = persona?.preferences as
    | Record<string, unknown>
    | undefined;
  const tone = preferences?.tone ?? 'friendly';
  const focus = preferences?.focus ?? 'education';
  const language = preferences?.language ?? 'English';
  const preamble = `Persona: {tone: ${tone}, focus: ${focus}, language: ${language}}\nTask: Answer the user's last message concisely and follow persona. Use clean GitHub-flavored Markdown with headings, lists, tables when useful, code fences for code, and a short Memory Hook if relevant.`;

  // Simple message trimming - just take last MAX_HISTORY messages
  const trimmed = messages.slice(-MAX_HISTORY);

  const history = trimmed
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
    .join('\n');

  return `${preamble}\n\n${history}\n\nAssistant:`;
}

export async function POST(req: NextRequest) {
  let chatId: string | undefined;

  try {
    // Dynamic imports to prevent build-time execution
    const { FieldValue, adminDb } = await import('@/lib/firebase-admin');
    const { extractAnswer, queryFlowiseWithRetry } = await import(
      '@/services/flowise'
    );

    const body = await req.json();
    const { chatId: extractedChatId, messageId } = body;
    chatId = extractedChatId;

    if (!chatId || !messageId) {
      return NextResponse.json(
        { error: 'chatId and messageId are required' },
        { status: 400 }
      );
    }

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

    const prompt = await buildPrompt(chatData?.persona ?? {}, messages);

    // Call LLM via Flowise
    let res;
    try {
      res = await queryFlowiseWithRetry({ question: prompt }, {}, 2, 400);
    } catch (error) {
      throw error;
    }
    const aiText =
      extractAnswer(res) || 'Sorry, I could not generate a response.';

    // Write AI message and update chat in a transaction
    const aiMsgRef = chatRef.collection('messages').doc();

    await adminDb.runTransaction(async t => {
      t.set(aiMsgRef, {
        role: 'ai',
        text: aiText,
        createdAt: FieldValue.serverTimestamp(),
      });
      t.update(chatRef, {
        updatedAt: FieldValue.serverTimestamp(),
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

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal Error' },
      { status: 500 }
    );
  }
}
