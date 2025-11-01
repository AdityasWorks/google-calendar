'use client';

import { useEffect } from 'react';
import { useCalendar } from '@/app/context/CalendarContext';
import {
  goToNextDay,
  goToPreviousDay,
  goToNextWeek,
  goToPreviousWeek,
  goToNextMonth,
  goToPreviousMonth,
} from '@/app/lib/date-utils';

export function useKeyboardShortcuts() {
  const { currentDate, setCurrentDate, viewMode, setViewMode, setIsEventModalOpen, isEventModalOpen } = useCalendar();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when modal is open or when typing in inputs
      if (isEventModalOpen || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Arrow keys for navigation
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (viewMode === 'month') {
          setCurrentDate(goToPreviousMonth(currentDate));
        } else if (viewMode === 'week') {
          setCurrentDate(goToPreviousWeek(currentDate));
        } else {
          setCurrentDate(goToPreviousDay(currentDate));
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (viewMode === 'month') {
          setCurrentDate(goToNextMonth(currentDate));
        } else if (viewMode === 'week') {
          setCurrentDate(goToNextWeek(currentDate));
        } else {
          setCurrentDate(goToNextDay(currentDate));
        }
      }

      // T for Today
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setCurrentDate(new Date());
      }

      // C for Create event
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsEventModalOpen(true);
      }

      // Number keys for view switching
      if (e.key === '1') {
        e.preventDefault();
        setViewMode('day');
      } else if (e.key === '2') {
        e.preventDefault();
        setViewMode('week');
      } else if (e.key === '3') {
        e.preventDefault();
        setViewMode('month');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentDate, viewMode, isEventModalOpen, setCurrentDate, setViewMode, setIsEventModalOpen]);
}
