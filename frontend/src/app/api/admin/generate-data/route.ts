import {
  generateDailyAnalytics,
  getSystemHealthMetrics,
} from '@/lib/analytics';
import {
  generateAnalyticsData,
  generateSampleData,
  initializeDatabaseWithSampleData,
} from '@/lib/data-generator';
import { NextRequest, NextResponse } from 'next/server';

// Admin API route for data generation and testing
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, count, days } = body;

    // Basic authentication check (in production, use proper auth)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.includes('Bearer admin-token')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    switch (action) {
      case 'initialize':
        const initResult = await initializeDatabaseWithSampleData();
        return NextResponse.json({
          success: true,
          message: 'Database initialized with sample data',
          data: initResult.data,
        });

      case 'generate_users':
        const userCount = count || 10;
        const sampleData = await generateSampleData(userCount);
        return NextResponse.json({
          success: true,
          message: `Generated ${userCount} users with related data`,
          data: sampleData,
        });

      case 'generate_analytics':
        const analyticsDays = days || 30;
        const analyticsData = await generateAnalyticsData(analyticsDays);
        return NextResponse.json({
          success: true,
          message: `Generated ${analyticsDays} days of analytics data`,
          data: { days: analyticsData.length },
        });

      case 'generate_daily_analytics':
        const dailyAnalytics = await generateDailyAnalytics();
        return NextResponse.json({
          success: true,
          message: 'Generated daily analytics',
          data: dailyAnalytics,
        });

      case 'system_health':
        const healthMetrics = await getSystemHealthMetrics();
        return NextResponse.json({
          success: true,
          message: 'System health metrics retrieved',
          data: healthMetrics,
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: unknown) {
    // Error logged for debugging
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get system status
    const healthMetrics = await getSystemHealthMetrics();

    return NextResponse.json({
      success: true,
      message: 'System status retrieved',
      data: {
        status: 'operational',
        timestamp: new Date().toISOString(),
        health: healthMetrics,
      },
    });
  } catch (error: unknown) {
    // Error logged for debugging
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
