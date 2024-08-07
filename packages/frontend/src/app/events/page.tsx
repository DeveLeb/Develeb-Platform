'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import PaginationControls from '@/components/atoms/PaginationControls';
import EventsDisplay from '@/components/molecules/EventsDisplay';
import EventSearchPanel from '@/components/molecules/EventSearchPanel';
import EventService from '@/services/EventService';

const EventPage = () => {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const per_page = searchParams.get('per_page') ? Number(searchParams.get('per_page')) : 12;

  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [type, setType] = useState<string>('');

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const per_page = searchParams.get('per_page') ? Number(searchParams.get('per_page')) : 12;

  const fetchEvents = async () => {
    try {
      const { events, total } = await EventService.getEvents(type, tags, title, page, per_page);
      setEvents(events);
      setTotalItems(total);
    } catch (error) {
      setError('Error fetching events');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [type, tags, title, page, per_page]);

  const handleSearch = (filters: { title: string; tags: string[]; type: string }) => {
    setTitle(filters.title);
    setTags(filters.tags);
    setType(filters.type);
  };

  const handlePageChange = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage.toString());
    window.history.pushState({}, '', url.toString());
    setPage(newPage);
  };

  return (
    <div className="relative">
      <EventSearchPanel onSearch={handleSearch} />
      {error ? (
        <div className="error">{error}</div>
      ) : events.length === 0 ? (
        <div className="no-events flex items-center justify-center min-h-screen text-center text-xl text-gray-500">
          <p>No events match your search criteria.</p>
        </div>
      ) : (
        <>
          <EventsDisplay events={events} />
          <div className="py-4">
            <PaginationControls
              currentPage={page}
              totalItems={totalItems}
              itemsPerPage={per_page}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EventPage;
