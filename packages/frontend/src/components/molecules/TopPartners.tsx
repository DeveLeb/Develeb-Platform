import Image from 'next/image';
import React from 'react';
import { BsArrowRight } from 'react-icons/bs';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import HomePageTitle from '../atoms/homePageTitle';

function TopPartners() {
  const images = ['jetBrains.jpg'];


  return (
    <div className="px-10 py-5 border-b-2 border-gray-500 mb-10">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-5">
        <div className="flex items-center gap-5 pl-5 p-8">
          <HomePageTitle title={'Top Partners'} />
          <BsArrowRight size={40} className="text-[var(--white)]" />
        </div>

        <ScrollArea className="w-full lg:w-[70%]">
          <div className="flex gap-5">
            {images.map((image, index) => (
              <Image
                key={index}
                src={`/images/TopPartners/${image}`}
                alt={`Partner ${index + 1}`}
                width={220} 
                height={220}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

export default TopPartners;
