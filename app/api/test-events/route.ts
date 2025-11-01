import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    // Test 1: Create an event
    const createResponse = await fetch(`${baseUrl}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Meeting',
        description: 'This is a test event',
        start_time: new Date('2025-11-02T10:00:00').toISOString(),
        end_time: new Date('2025-11-02T11:00:00').toISOString(),
        color: '#4285f4',
        is_all_day: false,
      }),
    });
    const createResult = await createResponse.json();
    
    // Test 2: Get all events
    const getResponse = await fetch(`${baseUrl}/api/events`);
    const getResult = await getResponse.json();
    
    return NextResponse.json({
      success: true,
      tests: {
        create: createResult,
        getAll: getResult,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed',
    }, { status: 500 });
  }
}
