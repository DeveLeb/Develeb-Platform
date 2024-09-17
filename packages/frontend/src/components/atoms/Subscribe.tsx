import React from 'react';
import { BsArrowRight } from 'react-icons/bs';

import { Input } from '../ui/input';
import { Button } from './button';

function Subscribe({ className }: { className: string }) {
  return (
    <div className={`subscribe-container rounded-sm sm:mx-16 ml:m-0 ${className}`}>
      <div className="bg-[var(--white)] text-[var(--dark-blue)] px-4 py-5 pb-10 sm:px-12 ml:px-12 rounded-lg">
        <h1 className="title font-semibold pb-3">Subscribe</h1>
        <div className="input-container flex w-full">
          <Input
            placeholder="email address"
            className="mb-3 bg-[var(--dark-blue)] placeholder-gray-300 text-[var(--white)] rounded-tl-md rounded-bl-md w-full"
            style={{ height: '48px' }}
          />
          <Button
            className="bg-[var(--green)] hover:bg-[var(--dark-blue)] rounded-tr-md rounded-br-md flex items-center justify-center"
            style={{ width: '48px', height: '48px' }}
          >
            <BsArrowRight size={20} className="text-[var(--dark-blue)] hover:text-[var(--white)]"  />
          </Button>
        </div>
        <div className="description text-xs text-[var(--gray)]">
          Hello, we are Lift Media. Our goal is to translate the positive effects from revolutionizing how companies
          engage with their clients & their team.
        </div>
      </div>
    </div>
  );
}

export default Subscribe;
