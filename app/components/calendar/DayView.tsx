"use client";

import type { Event } from "@/app/context/CalendarContext";
import { useCalendar } from "@/app/context/CalendarContext";
import { formatDate, getEventDuration, getEventsForDay, getTimeSlotPosition, getTimeSlots } from "@/app/lib/date-utils";
import { parseISO } from "date-fns";

export default function DayView({ onTimeSlotSelect }: { onTimeSlotSelect: (day: Date) => void }) {
    const { currentDate, events, setSelectedEvent, setIsEventModalOpen } = useCalendar();
    const timeSlots = getTimeSlots();
    const dayEvents = getEventsForDay(events, currentDate);

    const handleEventClick = (event: Event) => {
        onTimeSlotSelect(new Date(event.start_time));
        setSelectedEvent(event);
        setIsEventModalOpen(true);
    };

    const handleTimeSlotClick = (hour: number) => {
        const selectedDateTime = new Date(currentDate);
        selectedDateTime.setHours(hour, 0, 0, 0);
        onTimeSlotSelect(selectedDateTime);
        setSelectedEvent(null);
        setIsEventModalOpen(true);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Day header */}
            <div className="flex items-center justify-center py-4 border-b border-gray-200">
                <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 uppercase">{formatDate(currentDate, "EEEE")}</div>
                    <div className="text-3xl font-normal text-gray-900 mt-1">{formatDate(currentDate, "d")}</div>
                </div>
            </div>

            {/* Time grid */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex relative">
                    {/* Time labels */}
                    <div className="w-20 flex-shrink-0 border-r border-gray-200">
                        {timeSlots.map((time, index) => (
                            <div key={index} className="h-16 text-sm text-gray-500 text-right pr-3 -mt-2">
                                {time}
                            </div>
                        ))}
                    </div>

                    {/* Day column */}
                    <div className="flex-1 relative">
                        {/* Time slot grid */}
                        {timeSlots.map((_, hourIndex) => (
                            <div
                                key={hourIndex}
                                onClick={() => handleTimeSlotClick(hourIndex)}
                                className="h-16 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
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
                                    className="absolute left-2 right-2 rounded-md px-3 py-2 cursor-pointer hover:shadow-xl transition-shadow overflow-hidden"
                                    style={{
                                        top: `${(topPosition / 60) * 64}px`, // 64px per hour
                                        height: `${(duration / 60) * 64}px`,
                                        backgroundColor: event.color,
                                        minHeight: "32px",
                                        zIndex: 10,
                                    }}
                                >
                                    <div className="font-semibold text-white text-sm">{event.title}</div>
                                    <div className="text-white opacity-90 text-xs mt-1">
                                        {formatDate(startTime, "h:mm a")} -{" "}
                                        {formatDate(parseISO(event.end_time), "h:mm a")}
                                    </div>
                                    {event.location && (
                                        <div className="text-white opacity-80 text-xs mt-1">📍 {event.location}</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
