import React from 'react';
import HomePageTitle from '../atoms/homePageTitle';
import LatestEventCard from '../atoms/LatestEventCard';

const ArrowButton = ({ reverse }: { reverse: boolean }) => {
  return (
    <button className="bg-main_green rounded-full w-9 ml-2">
      <img src="/icons/arrow.svg" alt="" className={reverse ? 'transform rotate-180' : ''} />
    </button>
  );
};
function LatestSection({ title }: { title: string }) {
  return (
    <div className="px-10">
      <div className="text-main_green">
        <HomePageTitle title={title} />
      </div>
      <div className="text-right">
        <ArrowButton reverse={true} />
        <ArrowButton reverse={false} />
      </div>
      <div>
        <LatestEventCard />
      </div>
    </div>
  );
}

export default LatestSection;
