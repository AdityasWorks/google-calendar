'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '@/app/context/CalendarContext';
import {
  formatDate,
  goToNextMonth,
  goToPreviousMonth,
  goToNextWeek,
  goToPreviousWeek,
  goToNextDay,
  goToPreviousDay,
} from '@/app/lib/date-utils';

export default function CalendarHeader() {
  const { currentDate, setCurrentDate, viewMode, setViewMode } = useCalendar();

  const handlePrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(goToPreviousMonth(currentDate));
    } else if (viewMode === 'week') {
      setCurrentDate(goToPreviousWeek(currentDate));
    } else {
      setCurrentDate(goToPreviousDay(currentDate));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(goToNextMonth(currentDate));
    } else if (viewMode === 'week') {
      setCurrentDate(goToNextWeek(currentDate));
    } else {
      setCurrentDate(goToNextDay(currentDate));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getHeaderTitle = () => {
    if (viewMode === 'month') {
      return formatDate(currentDate, 'MMMM yyyy');
    } else if (viewMode === 'week') {
      return formatDate(currentDate, 'MMMM yyyy');
    } else {
      return formatDate(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2 md:gap-4">
        <h1 className="text-xl md:text-2xl font-normal text-gray-800">Calendar</h1>

        <button
          onClick={handleToday}
          className="px-3 md:px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          Today
        </button>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={handlePrevious}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <h2 className="hidden md:block text-xl font-normal text-gray-700">{getHeaderTitle()}</h2>
      </div>

      <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
        <button
          onClick={() => setViewMode('day')}
          className={`px-2 md:px-4 py-2 text-xs md:text-sm font-medium rounded transition-colors ${
            viewMode === 'day'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Day
        </button>
        <button
          onClick={() => setViewMode('week')}
          className={`px-2 md:px-4 py-2 text-xs md:text-sm font-medium rounded transition-colors ${
            viewMode === 'week'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setViewMode('month')}
          className={`px-2 md:px-4 py-2 text-xs md:text-sm font-medium rounded transition-colors ${
            viewMode === 'month'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Month
        </button>
      </div>
    </header>
  );
}
