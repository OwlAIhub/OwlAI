import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Test API route is working!',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      status: 'ok',
      message: 'POST request received',
      data: body,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      status: 'error',
      message: 'Invalid JSON',
    }, { status: 400 });
  }
}
