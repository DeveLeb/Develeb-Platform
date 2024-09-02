'use client';
import React, { useState } from 'react';

import HomePageTitle from '../atoms/homePageTitle';
import LatestEventCard from '../atoms/LatestEventCard';
import LatestJobCard from '../atoms/LatestJobCard';

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
      className={jobs ? 'bg-primary rounded-full w-9 ml-2' : 'bg-main_green rounded-full w-9 ml-2'}
      onClick={onClick}
    >
      <img src="/icons/arrow.svg" alt="" className={reverse ? 'transform rotate-180' : ''} />
    </button>
  );
};

function LatestSection({ title, jobs }: { title: string; jobs: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = jobs
    ? [
        <LatestJobCard
          key={0}
          title={'Lorem ipsum dollar Lorem ipsum  3'}
          jobDetails={{
            category: 'Category',
            location: 'Location',
            companyName: 'Company Name',
            salary: 'Salary',
            date: '2024-07-08',
          }}
        />,
        <LatestJobCard
          key={0}
          title="222"
          jobDetails={{
            category: 'cat1',
            location: 'loc1',
            companyName: 'company1',
            salary: '$123',
            date: '2024-07-08',
          }}
        />,
        <LatestJobCard
          key={0}
          title="333"
          jobDetails={{
            category: 'cat1',
            location: 'loc1',
            companyName: 'company1',
            salary: '$123',
            date: '2024-07-08',
          }}
        />,
      ]
    : [
        <LatestEventCard key={0} title="xxx" list={['virtual meet', 'zoom', '2024-07-08']} />,
        <LatestEventCard key={1} title="222" list={['virtual meet', 'zoom', '2024-07-08']} />,
        <LatestEventCard key={2} title="333" list={['virtual meet', 'zoom', '2024-07-08']} />,
      ];

  const totalCards = cards.length;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalCards);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalCards) % totalCards);
  };

  return (
    <div className="">
      <div className={jobs ? 'text-primary' : 'text-main_green'}>
        <HomePageTitle title={title} />
      </div>
      <div className="text-right mb-2 lg:hidden">
        <ArrowButton reverse={true} jobs={jobs} onClick={handlePrevious} />
        <ArrowButton reverse={false} jobs={jobs} onClick={handleNext} />
      </div>
      <div className="lg:flex lg:gap-5 lg:justify-between">
        <div className={`lg:hidden ${totalCards > 0 ? '' : 'hidden'}`}>{cards[currentIndex]}</div>
        <div className="hidden lg:flex lg:gap-5 lg:justify-between lg:w-full ">{cards}</div>
      </div>
    </div>
  );
}

export default LatestSection;
