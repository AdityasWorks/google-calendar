import pool from './db';

export interface Event {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  start_time: Date;
  end_time: Date;
  location?: string;
  color: string;
  is_all_day: boolean;
  recurrence_rule?: string;
  created_at: Date;
  updated_at: Date;
}

// Get all events for a user
export async function getEvents(userId: number): Promise<Event[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM events WHERE user_id = $1 ORDER BY start_time ASC',
      [userId]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

// Get events in a date range
export async function getEventsByDateRange(
  userId: number,
  startDate: Date,
  endDate: Date
): Promise<Event[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM events 
       WHERE user_id = $1 
       AND start_time <= $3 
       AND end_time >= $2
       ORDER BY start_time ASC`,
      [userId, startDate, endDate]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

// Create a new event
export async function createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO events (user_id, title, description, start_time, end_time, location, color, is_all_day, recurrence_rule)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        event.user_id,
        event.title,
        event.description || null,
        event.start_time,
        event.end_time,
        event.location || null,
        event.color,
        event.is_all_day,
        event.recurrence_rule || null,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Update an event
export async function updateEvent(id: number, userId: number, updates: Partial<Event>): Promise<Event | null> {
  const client = await pool.connect();
  try {
    const allowedFields = ['title', 'description', 'start_time', 'end_time', 'location', 'color', 'is_all_day', 'recurrence_rule'];
    const fields = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .map((key, index) => `${key} = $${index + 3}`)
      .join(', ');
    
    if (!fields) {
      return null;
    }

    const values = Object.entries(updates)
      .filter(([key]) => allowedFields.includes(key))
      .map(([, value]) => value);

    const result = await client.query(
      `UPDATE events 
       SET ${fields}, updated_at = NOW() 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [id, userId, ...values]
    );
    
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

// Delete an event
export async function deleteEvent(id: number, userId: number): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'DELETE FROM events WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rowCount !== null && result.rowCount > 0;
  } finally {
    client.release();
  }
}

// Get a single event by ID
export async function getEventById(id: number, userId: number): Promise<Event | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM events WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}
