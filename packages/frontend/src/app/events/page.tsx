'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import PaginationControls from '@/components/atoms/PaginationControls';
import EventsDisplay from '@/components/molecules/EventsDisplay';
import EventSearchPanel from '@/components/molecules/EventSearchPanel';
import { EventService } from '@/services/EventService';
import { Event } from '@/types';

const EventPage = () => {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [type, setType] = useState<string>('');

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const per_page = searchParams.get('per_page') ? Number(searchParams.get('per_page')) : 12;

  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [type, setType] = useState<string>('');
  const [page, setPage] = useState<number>(searchParams.get('page') ? Number(searchParams.get('page')) : 1);

  const per_page = searchParams.get('per_page') ? Number(searchParams.get('per_page')) : 12;

  useEffect(() => {
    try {
      new EventService().getEvents(type, tags, title, page, per_page).then(({ events }) => {
        setEvents(events);
        setTotalItems(events.length);
      });
    } catch (error) {
      setError('Error fetching events');
    }
  }, [page, per_page, tags, title, type]);

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
          <EventsDisplay events={events} currentPage={0} totalItems={0} itemsPerPage={0} />
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
