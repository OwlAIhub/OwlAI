import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Feedback API is running',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { adminDb } = await import('@/lib/firebase-admin');
    const { getGuestId } = await import('@/lib/guest');

    const body = await req.json();
    const { messageId, chatId, feedback, reason, messageText } = body;

    // Validate required fields
    if (!messageId || !chatId || !feedback) {
      return NextResponse.json(
        { error: 'messageId, chatId, and feedback are required' },
        { status: 400 }
      );
    }

    if (feedback !== 'up' && feedback !== 'down') {
      return NextResponse.json(
        { error: 'feedback must be "up" or "down"' },
        { status: 400 }
      );
    }

    // Get guest ID
    const guestId = getGuestId();
    if (!guestId) {
      return NextResponse.json(
        { error: 'Guest ID not available' },
        { status: 401 }
      );
    }

    // Create feedback document
    const feedbackData = {
      messageId,
      chatId,
      guestId,
      feedback,
      reason: reason || null,
      messageText: messageText || null,
      createdAt: new Date(),
    };

    const feedbackRef = await adminDb.collection('feedback').add(feedbackData);

    return NextResponse.json({
      success: true,
      feedbackId: feedbackRef.id,
      message: 'Feedback recorded successfully',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
