import Image from 'next/image';
import * as React from 'react';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export interface Founder {
  name: string;
  description: string;
  about: string;
  image: string;
}

export const founders: Founder[] = [
  {
    name: 'Hassan Kataya',
    about: 'Software Engineer | Mentor | Community Lead',
    description: 'Community founder and CEO, passionate about innovation and collaboration.',
    image: '/images/Founders/HasanKT.jfif',
  },
  {
    name: 'Tom Byrom',
    about: 'Software Engineer | Mentor | Community Lead',
    description: 'Lead developer, expert in frontend technologies and a problem solver.',
    image: '/images/Founders/HasanKT.jfif',
  },
  {
    name: 'Ornella Binni',
    about: 'Software Engineer | Mentor | Community Lead',
    description: 'Community founder and CEO, passionate about innovation and collaboration.',
    image: '/images/Founders/HasanKT.jfif',
  },
];

export function CommunityFoundersSection() {
  return (
    <section className="px-16 py-20 flex justify-center">
      <div className="w-full max-w-5xl">
        <Carousel className="relative">
          <CarouselContent className="flex">
            {founders.map((founder) => (
              <CarouselItem key={founder.name} className="flex-shrink-0 w-full">
                <div className="flex items-center justify-between p-12 bg-[var(--white)] rounded-lg shadow-lg">
                  <div className="flex-1 pr-12 relative">
                    <FaQuoteLeft className="absolute -top-16 -left-10 text-[var(--green)] text-6xl" />
                    <FaQuoteRight className="absolute -bottom-16 -right-10 text-[var(--green)] text-6xl" />
                    <p className="text-lg text-[var(--gray)] relative">{founder.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-center flex flex-col items-center justify-center">
                    <Image src={founder.image} alt={founder.name} className="rounded-full" width={220} height={220} />
                    <h3 className="text-2xl font-semibold mt-4">{founder.name}</h3>
                    <p className="text-base text-[var(--gray)] mt-2">{founder.about}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[var(--green)] text-[var(--dark-blue)]" />
          <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[var(--green)] text-[var(--dark-blue)]" />
        </Carousel>
      </div>
    </section>
  );
}
