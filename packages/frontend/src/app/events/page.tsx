'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import EventsDisplay from '@/components/molecules/EventsDisplay';
import EventSearchPanel from '@/components/molecules/EventSearchPanel';
import EventService from '@/services/EventService';

interface Event {
  id: number;
  date: string;
  description: string;
  flyer_link: string;
}

const EventPage = () => {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const per_page = searchParams.get('per_page') ? Number(searchParams.get('per_page')) : 12;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { events, total } = await EventService.getEvents(undefined, undefined, undefined, page, per_page);
        setEvents(events);
        setTotalItems(total);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchEvents();
  }, [page, per_page]);

  return (
    <div>
      <EventSearchPanel />
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <EventsDisplay events={events} currentPage={page} totalItems={totalItems} itemsPerPage={per_page} />
      )}
    </div>
  );
};

export default EventPage;
