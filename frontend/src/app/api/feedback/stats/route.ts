import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { adminDb } = await import('@/lib/firebase-admin');

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');

    let query = adminDb.collection('feedback');

    if (chatId) {
      query = query.where('chatId', '==', chatId);
    }

    const snapshot = await query.get();
    const feedbacks = snapshot.docs.map(doc => doc.data());

    const total = feedbacks.length;
    const positive = feedbacks.filter(f => f.feedback === 'up').length;
    const negative = feedbacks.filter(f => f.feedback === 'down').length;
    const positiveRate = total > 0 ? (positive / total) * 100 : 0;

    return NextResponse.json({
      total,
      positive,
      negative,
      positiveRate: Math.round(positiveRate * 100) / 100, // Round to 2 decimal places
    });
  } catch (error) {
    console.error('Feedback stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get feedback stats' },
      { status: 500 }
    );
  }
}
