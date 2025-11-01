import { z } from 'zod';

// Schema for creating an event
export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  start_time: z.string().datetime('Invalid start time format'),
  end_time: z.string().datetime('Invalid end time format'),
  location: z.string().max(255).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional().default('#4285f4'),
  is_all_day: z.boolean().optional().default(false),
  recurrence_rule: z.string().optional(),
}).refine((data) => {
  const start = new Date(data.start_time);
  const end = new Date(data.end_time);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

// Schema for updating an event
export const updateEventSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
  location: z.string().max(255).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  is_all_day: z.boolean().optional(),
  recurrence_rule: z.string().optional(),
}).refine((data) => {
  if (data.start_time && data.end_time) {
    const start = new Date(data.start_time);
    const end = new Date(data.end_time);
    return end > start;
  }
  return true;
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

// Schema for query parameters
export const getEventsQuerySchema = z.object({
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type GetEventsQuery = z.infer<typeof getEventsQuerySchema>;
