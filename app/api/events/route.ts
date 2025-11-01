import { NextRequest, NextResponse } from 'next/server';
import { 
  getEvents, 
  getEventsByDateRange, 
  createEvent 
} from '@/app/lib/db-helpers';
import { 
  createEventSchema, 
  getEventsQuerySchema 
} from '@/app/lib/validation';
import { ZodError } from 'zod';

const CURRENT_USER_ID = 1;

// GET /api/events - Get all events or events by date range
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    const query = getEventsQuerySchema.parse({
      start_date: start_date || undefined,
      end_date: end_date || undefined,
    });

    let events;
    
    if (query.start_date && query.end_date) {
      events = await getEventsByDateRange(
        CURRENT_USER_ID,
        new Date(query.start_date),
        new Date(query.end_date)
      );
    } else {
      events = await getEvents(CURRENT_USER_ID);
    }

    const serializedEvents = events.map(event => ({
      ...event,
      start_time: event.start_time.toISOString(),
      end_time: event.end_time.toISOString(),
      created_at: event.created_at.toISOString(),
      updated_at: event.updated_at.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: serializedEvents,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
        details: error.issues, // Changed from error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch events',
    }, { status: 500 });
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = createEventSchema.parse(body);

    const newEvent = await createEvent({
      user_id: CURRENT_USER_ID,
      title: validatedData.title,
      description: validatedData.description,
      start_time: new Date(validatedData.start_time),
      end_time: new Date(validatedData.end_time),
      location: validatedData.location,
      color: validatedData.color || '#4285f4',
      is_all_day: validatedData.is_all_day || false,
      recurrence_rule: validatedData.recurrence_rule,
    });

    const serializedEvent = {
      ...newEvent,
      start_time: newEvent.start_time.toISOString(),
      end_time: newEvent.end_time.toISOString(),
      created_at: newEvent.created_at.toISOString(),
      updated_at: newEvent.updated_at.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: serializedEvent,
      message: 'Event created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data',
        details: error.issues, // Changed from error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create event',
    }, { status: 500 });
  }
}
