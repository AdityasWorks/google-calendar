'use client';

import Modal from '@/app/components/ui/Modal';
import EventForm from './EventForm';
import { useCalendar } from '@/app/context/CalendarContext';

interface EventModalProps {
  initialDate?: Date;
}

export default function EventModal({ initialDate }: EventModalProps) {
  const { isEventModalOpen, setIsEventModalOpen, selectedEvent, refreshEvents } = useCalendar();

  const handleSave = () => {
    refreshEvents();
  };

  const handleClose = () => {
    setIsEventModalOpen(false);
  };

  return (
    <Modal
      isOpen={isEventModalOpen}
      onClose={handleClose}
      title={selectedEvent ? 'Edit Event' : 'New Event'}
      size="medium"
    >
      <EventForm
        event={selectedEvent}
        onSave={handleSave}
        onClose={handleClose}
        initialDate={initialDate}
      />
    </Modal>
  );
}
