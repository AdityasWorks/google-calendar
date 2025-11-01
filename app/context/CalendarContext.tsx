'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export interface Event {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  start_time: string; // ISO string for JSON serialization
  end_time: string;
  location?: string;
  color: string;
  is_all_day: boolean;
  recurrence_rule?: string;
  created_at?: string;
  updated_at?: string;
}

type ViewMode = 'month' | 'week' | 'day';

interface CalendarContextType {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
  isEventModalOpen: boolean;
  setIsEventModalOpen: (isOpen: boolean) => void;
  refreshEvents: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshEvents = () => {
  // Dispatch custom event to trigger reload
  window.dispatchEvent(new Event('refreshEvents'));
};


  const value = useMemo(
    () => ({
      currentDate,
      setCurrentDate,
      viewMode,
      setViewMode,
      selectedEvent,
      setSelectedEvent,
      events,
      setEvents,
      isEventModalOpen,
      setIsEventModalOpen,
      refreshEvents,
    }),
    [currentDate, viewMode, selectedEvent, events, isEventModalOpen, refreshTrigger]
  );

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
}
