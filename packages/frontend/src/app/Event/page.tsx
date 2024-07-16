'use client';
// src/app/Event/page.tsx
import React from 'react';
import EventSearchPanel from '../../components/molecules/EventSearchPanel';

const EventPage = () => {
  const handleSearch = () => {
    alert('Searching for events...');
  };

  return (
    <div className="flex items-start justify-start min-h-screen bg-gray-100">
      <EventSearchPanel onSearch={handleSearch} />
    </div>
  );
};
export default EventPage;

