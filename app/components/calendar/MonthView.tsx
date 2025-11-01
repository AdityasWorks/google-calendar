"use client";

import { Event, useCalendar } from "@/app/context/CalendarContext";
import { updateEventAPI } from "@/app/lib/api-client";
import {
    formatDate,
    getEventsForDay,
    getMonthCalendarDays,
    isDateInMonth,
    isDateToday,
    WEEKDAYS,
} from "@/app/lib/date-utils";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { useState } from "react";

function DraggableEvent({ event, onClick }: { event: Event; onClick: () => void }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `event-${event.id}`,
        data: { event },
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded hover:shadow-md transition-shadow group ${
                isDragging ? "opacity-50" : ""
            }`}
            style={{
                backgroundColor: event.color + "20",
                borderLeft: `3px solid ${event.color}`,
            }}
        >
            {/* Drag Handle - Only this part can be dragged */}
            <div
                {...listeners}
                {...attributes}
                className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                onClick={e => e.stopPropagation()}
            >
                <GripVertical className="w-3 h-3 text-gray-400" />
            </div>

            {/* Event Content - Clickable but not draggable */}
            <div
                className="flex-1 truncate cursor-pointer text-gray-900"
                onClick={e => {
                    e.stopPropagation();
                    onClick();
                }}
            >
                {event.title}
            </div>
        </div>
    );
}

function DroppableDay({ day, children, onClick }: { day: Date; children: React.ReactNode; onClick: () => void }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `day-${day.toISOString()}`,
        data: { day },
    });

    return (
        <div
            ref={setNodeRef}
            onClick={onClick}
            className={`min-h-[120px] border-r border-b border-gray-200 p-2 cursor-pointer transition-colors ${
                isOver ? "bg-blue-50" : "hover:bg-gray-50"
            }`}
        >
            {children}
        </div>
    );
}

export default function MonthView({ onDaySelect }: { onDaySelect: (day: Date) => void }) {
    const { currentDate, events, setEvents, setSelectedEvent, setIsEventModalOpen } = useCalendar();
    const calendarDays = getMonthCalendarDays(currentDate);
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);

    const handleDayClick = (day: Date) => {
        onDaySelect(day);
        setSelectedEvent(null);
        setIsEventModalOpen(true);
    };

    const handleEventClick = (event: Event) => {
        onDaySelect(new Date(event.start_time)); // Pass event date
        setSelectedEvent(event);
        setIsEventModalOpen(true);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveEvent(event.active.data.current?.event as Event);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveEvent(null);

        if (!over) return;

        const draggedEvent = active.data.current?.event as Event;
        const targetDay = over.data.current?.day as Date;

        if (!draggedEvent || !targetDay) return;

        // Calculate time difference
        const oldStart = new Date(draggedEvent.start_time);
        const oldEnd = new Date(draggedEvent.end_time);
        const duration = oldEnd.getTime() - oldStart.getTime();

        // Create new start time with same time of day but new date
        const newStart = new Date(targetDay);
        newStart.setHours(oldStart.getHours(), oldStart.getMinutes(), 0, 0);

        const newEnd = new Date(newStart.getTime() + duration);

        // Optimistically update the UI immediately
        const updatedEvents = events.map(evt =>
            evt.id === draggedEvent.id
                ? {
                      ...evt,
                      start_time: newStart.toISOString(),
                      end_time: newEnd.toISOString(),
                  }
                : evt
        );
        setEvents(updatedEvents);

        try {
            // Update on server in background
            await updateEventAPI(draggedEvent.id, {
                start_time: newStart.toISOString(),
                end_time: newEnd.toISOString(),
            });
            // Only refresh if we want to sync with server (optional)
            // refreshEvents();
        } catch (error) {
            console.error("Failed to update event:", error);
            // Revert optimistic update on error
            setEvents(events);
        }
    };

    return (
        <>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="flex flex-col h-full bg-white">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 border-b border-gray-200">
                        {WEEKDAYS.map(day => (
                            <div
                                key={day}
                                className="py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 flex-1 overflow-auto">
                        {calendarDays.map((day, index) => {
                            const dayEvents = getEventsForDay(events, day);
                            const isCurrentMonth = isDateInMonth(day, currentDate);
                            const isToday = isDateToday(day);

                            return (
                                <DroppableDay key={index} day={day} onClick={() => handleDayClick(day)}>
                                    <div className={`${!isCurrentMonth ? "bg-gray-50" : ""}`}>
                                        {/* Day Number */}
                                        <div className="flex justify-center mb-1">
                                            <span
                                                className={`flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full ${
                                                    isToday
                                                        ? "bg-blue-600 text-white"
                                                        : isCurrentMonth
                                                        ? "text-gray-900"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                {formatDate(day, "d")}
                                            </span>
                                        </div>

                                        {/* Events */}
                                        <div className="space-y-1">
                                            {dayEvents.slice(0, 3).map(event => (
                                                <DraggableEvent
                                                    key={event.id}
                                                    event={event}
                                                    onClick={() => handleEventClick(event)}
                                                />
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <div className="text-xs text-gray-500 px-2">
                                                    +{dayEvents.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </DroppableDay>
                            );
                        })}
                    </div>
                </div>

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeEvent && (
                        <div
                            className="text-xs px-2 py-1 rounded shadow-lg"
                            style={{
                                backgroundColor: activeEvent.color + "20",
                                borderLeft: `3px solid ${activeEvent.color}`,
                            }}
                        >
                            {activeEvent.title}
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </>
    );
}
