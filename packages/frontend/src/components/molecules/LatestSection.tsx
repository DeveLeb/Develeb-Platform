'use client';
import React, { useState } from 'react';
import useSWR from 'swr';

import { EventService } from '@/services/EventService';

import HomePageTitle from '../atoms/homePageTitle';
import LatestEventCard from '../atoms/LatestEventCard';
import LatestJobCard from '../atoms/LatestJobCard';


const eventService = new EventService();
const fetchEvents = async () => {
  const { events } = await eventService.getEvents();
  return events;
};

const ArrowButton = ({
  reverse = false,
  jobs = false,
  onClick,
}: {
  reverse: boolean;
  jobs: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={jobs ? 'bg-[var(--dark-blue)] rounded-full w-9 ml-2' : 'bg-[var(--green)] rounded-full w-9 ml-2'}
      onClick={onClick}
    >
      <img src="/icons/arrow.svg" alt="" className={reverse ? 'transform rotate-180' : ''} />
    </button>
  );
};

function LatestSection({ title, jobs }: { title: string; jobs: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: events, error } = useSWR('/events', fetchEvents);

  if (error) return <div>Failed to load events</div>;
  if (!events) return <div>Loading...</div>;

  const cards = jobs
    ? [
        <LatestJobCard
          key={0}
          title="Software Engineer Opportunity"
          jobDetails={{
            category: 'Full-Time',
            location: 'Remote',
            companyName: 'Avua',
            salary: '-',
            date: '2024-09-21',
          }}
          link="/jobs/avua"
          imageSrc="/images/companies/Avua.jpeg"
        />,
        <LatestJobCard
          key={1}
          title="Fullstack Developer Opportunity"
          jobDetails={{
            category: 'Fullstack',
            location: 'on-site',
            companyName: 'Presentail',
            salary: '-',
            date: '2024-09-21',
          }}
          link="/jobs/presentail"
          imageSrc="/images/companies/Presentail.jpeg"
        />,
        <LatestJobCard
          key={2}
          title="Software Developer Opportunity"
          jobDetails={{
            category: 'Full-Time',
            location: 'on-site',
            companyName: 'OutSourcement',
            salary: '-',
            date: '2024-07-08',
          }}
          link="/jobs/outsourcement"
          imageSrc="/images/companies/OutSourcement.jpeg"
        />,
      ]
    : events.map((event, index) => (
        <LatestEventCard key={index} title={event.title} list={[event.type, event.location, event.date]} />
      ));

  const totalCards = cards.length;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalCards);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalCards) % totalCards);
  };

  return (
    <div>
      <div className={jobs ? 'text-primary' : 'text-[var(--green)] '}>
        <HomePageTitle title={title} />
      </div>
      <div className="text-right mb-2 lg:hidden">
        <ArrowButton reverse={true} jobs={jobs} onClick={handlePrevious} />
        <ArrowButton reverse={false} jobs={jobs} onClick={handleNext} />
      </div>
      <div className="lg:flex lg:gap-5 lg:justify-between">
        <div className={`lg:hidden ${totalCards > 0 ? '' : 'hidden'}`}>{cards[currentIndex]}</div>
        <div className="hidden lg:flex lg:gap-5 lg:justify-between lg:w-full">{cards}</div>
      </div>
    </div>
  );
}

export default LatestSection;

