'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import useSWR from 'swr';

import PaginationControls from '@/components/atoms/PaginationControls';
import EventsDisplay from '@/components/molecules/EventsDisplay';
import EventSearchPanel from '@/components/molecules/EventSearchPanel';
import { EventService } from '@/services/EventService';

const fetcher = async (type: string, tags: string[], title: string, page: number, perPage: number) => {
  const { events } = await new EventService().getEvents(type, tags, title, page, perPage);
  return events;
};

const EventPage = () => {
  const searchParams = useSearchParams();

  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [type, setType] = useState<string>('');

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const per_page = searchParams.get('per_page') ? Number(searchParams.get('per_page')) : 12;

  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [type, setType] = useState<string>('');
  const [page, setPage] = useState<number>(searchParams.get('page') ? Number(searchParams.get('page')) : 1);

  const perPage = searchParams.get('perPage') ? Number(searchParams.get('perPage')) : 12;

  const { data: events, error } = useSWR([type, tags, title, page, perPage], fetcher);

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
        <div className="error">Error fetching events</div>
      ) : !events ? (
        <div className="loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="no-events flex items-center justify-center min-h-screen text-center text-xl text-gray-500">
          <p>No events match your search criteria.</p>
        </div>
      ) : (
        <>
          <EventsDisplay events={events} currentPage={page} totalItems={events.length} itemsPerPage={perPage} />
          <div className="py-4">
            <PaginationControls
              currentPage={page}
              totalItems={events.length}
              itemsPerPage={perPage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EventPage;
