import type { Event } from "@/app/context/CalendarContext";
import {
    addDays,
    addMonths,
    addWeeks,
    eachDayOfInterval,
    eachHourOfInterval,
    endOfDay,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    parseISO,
    setHours,
    startOfDay,
    startOfMonth,
    startOfWeek,
    subMonths,
    subWeeks,
} from "date-fns";

// Generate calendar grid for month view (42 cells = 6 rows × 7 days)
export function getMonthCalendarDays(date: Date): Date[] {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

// Generate days for week view (7 days)
export function getWeekCalendarDays(date: Date): Date[] {
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: weekStart, end: weekEnd });
}

// Generate hours for day/week view (0-23)
export function getDayHours(): Date[] {
    const today = startOfDay(new Date());
    return eachHourOfInterval({
        start: today,
        end: setHours(today, 23),
    });
}

// Check if date is in current month
export function isDateInMonth(date: Date, currentMonth: Date): boolean {
    return isSameMonth(date, currentMonth);
}

// Check if date is today
export function isDateToday(date: Date): boolean {
    return isToday(date);
}

// Check if two dates are the same day
export function areDatesEqual(date1: Date, date2: Date): boolean {
    return isSameDay(date1, date2);
}

// Format date for display
export function formatDate(date: Date, formatStr: string): string {
    return format(date, formatStr);
}

// Navigation helpers
export function goToNextMonth(date: Date): Date {
    return addMonths(date, 1);
}

export function goToPreviousMonth(date: Date): Date {
    return subMonths(date, 1);
}

export function goToNextWeek(date: Date): Date {
    return addWeeks(date, 1);
}

export function goToPreviousWeek(date: Date): Date {
    return subWeeks(date, 1);
}

export function goToNextDay(date: Date): Date {
    return addDays(date, 1);
}

export function goToPreviousDay(date: Date): Date {
    return addDays(date, -1);
}

// Get time slot position (for positioning events in day/week view)
export function getTimeSlotPosition(time: Date): number {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return hours * 60 + minutes; // Total minutes from midnight
}

// Calculate event duration in minutes
export function getEventDuration(startTime: string, endTime: string): number {
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    return (end.getTime() - start.getTime()) / (1000 * 60);
}

// Check if event spans multiple days
export function isMultiDayEvent(startTime: string, endTime: string): boolean {
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    return !isSameDay(start, end);
}

// Get events for a specific day
export function getEventsForDay(events: Event[], day: Date): Event[] {
    return events.filter(event => {
        const eventStart = parseISO(event.start_time);
        const eventEnd = parseISO(event.end_time);
        const dayStart = startOfDay(day);
        const dayEnd = endOfDay(day);

        // Event overlaps with this day
        return eventStart <= dayEnd && eventEnd >= dayStart;
    });
}

// Days of week labels
export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Time slots for day/week view (every hour)
export function getTimeSlots(): string[] {
    return Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 || 12;
        const period = i < 12 ? "AM" : "PM";
        return `${hour} ${period}`;
    });
}
