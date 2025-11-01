import { Event } from '@/app/context/CalendarContext';
import { CreateEventInput, UpdateEventInput } from './validation';

const API_BASE = '/api/events';

export async function fetchEvents(startDate?: Date, endDate?: Date): Promise<Event[]> {
  try {
    let url = API_BASE;
    
    if (startDate && endDate) {
      const params = new URLSearchParams({
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      });
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch events');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export async function createEventAPI(eventData: CreateEventInput): Promise<Event> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create event');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

export async function updateEventAPI(
  eventId: number,
  updates: UpdateEventInput
): Promise<Event> {
  try {
    const response = await fetch(`${API_BASE}/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update event');
    }

    return result.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

export async function deleteEventAPI(eventId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/${eventId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete event');
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}
