"use client";

import { useCalendar } from "@/app/context/CalendarContext";
import { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import DayView from "./DayView";
import EventModal from "./EventModal";
import MonthView from "./MonthView";
import WeekView from "./WeekView";

interface CalendarProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function Calendar({ user }: CalendarProps) {
    const { viewMode } = useCalendar();
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    return (
        <>
            <div className="h-screen flex flex-col">
                <CalendarHeader user={user} />
                <div className="flex-1 overflow-hidden">
                    {viewMode === "month" && <MonthView onDaySelect={setSelectedDay} />}
                    {viewMode === "week" && <WeekView onTimeSlotSelect={setSelectedDay} />}
                    {viewMode === "day" && <DayView onTimeSlotSelect={setSelectedDay} />}
                </div>
            </div>
            <EventModal initialDate={selectedDay || undefined} />
        </>
    );
}
