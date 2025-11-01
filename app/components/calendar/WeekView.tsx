"use client";

import type { Event } from "@/app/context/CalendarContext";
import { useCalendar } from "@/app/context/CalendarContext";
import {
    formatDate,
    getEventDuration,
    getEventsForDay,
    getTimeSlotPosition,
    getTimeSlots,
    getWeekCalendarDays,
    isDateToday,
    WEEKDAYS,
} from "@/app/lib/date-utils";
import { parseISO } from "date-fns";

export default function WeekView({ onTimeSlotSelect }: { onTimeSlotSelect: (day: Date) => void }) {
    const { currentDate, events, setSelectedEvent, setIsEventModalOpen } = useCalendar();
    const weekDays = getWeekCalendarDays(currentDate);
    const timeSlots = getTimeSlots();

    const handleEventClick = (event: Event) => {
        onTimeSlotSelect(new Date(event.start_time));
        setSelectedEvent(event);
        setIsEventModalOpen(true);
    };

    const handleTimeSlotClick = (day: Date, hour: number) => {
        const selectedDateTime = new Date(day);
        selectedDateTime.setHours(hour, 0, 0, 0);
        onTimeSlotSelect(selectedDateTime);
        setSelectedEvent(null);
        setIsEventModalOpen(true);
    };

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            {/* Header with days */}
            <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
                {/* Time gutter */}
                <div className="w-16 flex-shrink-0 border-r border-gray-200"></div>

                {/* Day columns */}
                {weekDays.map((day, index) => {
                    const isToday = isDateToday(day);
                    return (
                        <div key={index} className="flex-1 text-center py-3 border-r border-gray-200 last:border-r-0">
                            <div className="text-xs font-medium text-gray-600 uppercase">{WEEKDAYS[index]}</div>
                            <div className={`text-2xl font-normal mt-1 ${isToday ? "text-blue-600" : "text-gray-900"}`}>
                                {formatDate(day, "d")}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Time grid */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex relative">
                    {/* Time labels */}
                    <div className="w-16 flex-shrink-0 border-r border-gray-200">
                        {timeSlots.map((time, index) => (
                            <div key={index} className="h-12 text-xs text-gray-500 text-right pr-2 -mt-2">
                                {time}
                            </div>
                        ))}
                    </div>

                    {/* Day columns with events */}
                    {weekDays.map((day, dayIndex) => {
                        const dayEvents = getEventsForDay(events, day);

                        return (
                            <div key={dayIndex} className="flex-1 relative border-r border-gray-200 last:border-r-0">
                                {/* Time slot grid */}
                                {timeSlots.map((_, hourIndex) => (
                                    <div
                                        key={hourIndex}
                                        onClick={() => handleTimeSlotClick(day, hourIndex)}
                                        className="h-12 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                                    ></div>
                                ))}

                                {/* Events overlay */}
                                {dayEvents.map(event => {
                                    const startTime = parseISO(event.start_time);
                                    const topPosition = getTimeSlotPosition(startTime);
                                    const duration = getEventDuration(event.start_time, event.end_time);

                                    return (
                                        <div
                                            key={event.id}
                                            onClick={() => handleEventClick(event)}
                                            className="absolute left-1 right-1 rounded px-2 py-1 text-xs cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                                            style={{
                                                top: `${(topPosition / 60) * 48}px`, // 48px per hour
                                                height: `${(duration / 60) * 48}px`,
                                                backgroundColor: event.color,
                                                zIndex: 10,
                                            }}
                                        >
                                            <div className="font-medium text-white">{event.title}</div>
                                            <div className="text-white opacity-90 text-[10px]">
                                                {formatDate(startTime, "h:mm a")}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
