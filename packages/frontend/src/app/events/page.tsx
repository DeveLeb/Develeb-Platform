'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import useSWR from 'swr';

import PaginationControls from '@/components/atoms/PaginationControls';
import EventsDisplay from '@/components/molecules/EventsDisplay';
import EventSearchPanel from '@/components/molecules/EventSearchPanel';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { EventService } from '@/services/EventService';

const fetcher = async (type: string, tags: string[], title: string, page: number, perPage: number) => {
  const { events } = await new EventService().getEvents(type, tags, title, page, perPage);
  return events;
};

const EventPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

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
    const newQueryParams = new URLSearchParams(window.location.search);
    newQueryParams.set('page', newPage.toString());
    newQueryParams.set('perPage', perPage.toString());

    router.push('?${newQueryParams.toString()}');
    setPage(newPage);
  };

  return (
    <div className="relative">
      <EventSearchPanel onSearch={handleSearch} />
      {error ? (
        <div className="error">Error fetching events</div>
      ) : !events ? (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner className="w-12 h-12 text-primary" /> 
        </div>
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
