'use client';

import { useState } from 'react';
import { useCalendar } from '@/app/context/CalendarContext';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import CalendarHeader from './CalendarHeader';
import EventModal from './EventModal';

export default function Calendar() {
  const { viewMode } = useCalendar();
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  return (
    <>
      <div className="h-screen flex flex-col">
        <CalendarHeader />
        <div className="flex-1 overflow-hidden">
          {viewMode === 'month' && <MonthView onDaySelect={setSelectedDay} />}
          {viewMode === 'week' && <WeekView onTimeSlotSelect={setSelectedDay} />}
          {viewMode === 'day' && <DayView onTimeSlotSelect={setSelectedDay} />}
        </div>
      </div>
      <EventModal initialDate={selectedDay || undefined} />
    </>
  );
}
