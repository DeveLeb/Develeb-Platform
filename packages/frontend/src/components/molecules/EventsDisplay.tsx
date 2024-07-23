import React from 'react';
import { CiCalendar } from 'react-icons/ci';

import { Card } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Event {
  id: number;
  date: string;
  description: string;
  flyer_link: string;
}

interface EventsDisplayProps {
  events: Event[];
}

const EventsDisplay: React.FC<EventsDisplayProps> = ({ events }) => {
  return (
    <div className="sm:min-h-screen sm:p-11 p-4">
      <h3 className="text-3xl font-bold text-main-darkBlue mb-3 text-left">All Events</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {events.map((event) => (
          <a href={`/event/${event.id}`} key={event.id} className="block">
            <Card
              className="shadow-lg h-[320px] sm:h-[380px] flex flex-col bg-cover bg-center relative transform transition-transform duration-300 hover:scale-105"
              style={{ backgroundImage: `url(${event.flyer_link})` }}
            >
              <div className="flex-grow flex flex-col justify-end p-4 bg-main-darkBlue bg-opacity-70 hover:bg-opacity-80 relative">
                <h4 className="text-xl font-bold text-white flex items-center">
                  <CiCalendar className="text-white text-xl mr-2" />
                  {event.date}
                </h4>
                <p className="text-white mt-2">{event.description}</p>
              </div>
            </Card>
          </a>
        ))}
      </div>

      <div className="mt-8">
        <Pagination>
          <PaginationContent className="flex items-center space-x-2">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className="p-2 sm:p-3 bg-transparent hover:bg-main-darkBlue text-main-darkBlue hover:text-white border border-main-darkBlue rounded-none"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="p-2 sm:p-3 bg-transparent hover:bg-main-darkBlue text-main-darkBlue hover:text-white border border-main-darkBlue rounded-none"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="p-2 sm:p-3 bg-transparent hover:bg-main-darkBlue text-main-darkBlue hover:text-white border border-main-darkBlue rounded-none"
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis className="flex items-center justify-center p-2 sm:p-3" />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                className="p-2 sm:p-3 bg-transparent hover:bg-main-darkBlue text-main-darkBlue hover:text-white border border-main-darkBlue rounded-none"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default EventsDisplay;
