import React from 'react';
import { CiCalendar } from 'react-icons/ci';

import PaginationControls from '@/components/atoms/PaginationControls';
import { Card } from '@/components/ui/card';
import { Event } from '@/types/Event';

interface EventsDisplayProps {
  events: Event[];
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

const EventsDisplay: React.FC<EventsDisplayProps> = ({ events, currentPage, totalItems, itemsPerPage }) => {
  return (
    <div className="sm:min-h-screen sm:p-11 p-4">
      <h3 className="text-3xl font-bold text-[var(--dark-blue)] mb-3 text-left">All Events</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {events.map((event) => (
          <a href={`/event/${event.id}`} key={event.id} className="block">
            <Card
              className="shadow-lg h-[320px] sm:h-[380px] flex flex-col bg-cover bg-center relative transform transition-transform duration-300 hover:scale-105"
              style={{ backgroundImage: `url(${event.flyerLink})` }}
            >
              <div className="flex-grow flex flex-col justify-end p-4">
                <h4 className="text-xl font-bold text-[var(--white)] flex items-center">
                  <CiCalendar className="text-[var(--white)] text-xl mr-2" />
                  {event.date}
                </h4>
                <p className="text-[var(--white)] mt-2">{event.description}</p>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
};

export default EventsDisplay;
