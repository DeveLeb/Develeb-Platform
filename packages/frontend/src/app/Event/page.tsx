'use client';

import React, { useEffect, useState } from 'react';

import EventsDisplay from '@/components/molecules/EventsDisplay';
import EventSearchPanel from '@/components/molecules/EventSearchPanel';

interface Event {
  id: number;
  date: string;
  description: string;
  flyer_link: string;
}

const EventPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/_data/MOCK_DATA.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = () => {
    alert('Searching for events...');
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="sm:min-h-screen w-full overflow-x-hidden flex flex-col items-center">
      <EventSearchPanel onSearch={handleSearch} />
      <div className="sm:min-h-screen sm:p-12 p-4 w-full">
        <EventsDisplay events={events} />
      </div>
    </div>
  );
};

export default EventPage;
