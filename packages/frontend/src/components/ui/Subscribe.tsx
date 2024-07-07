import React from 'react';
import { Input } from './input';
import { Button } from './button';
function Subscribe({ className }: { className: string }) {
  return (
    <div className={`subscribe-container ${className}`}>
      <div className={`bg-gray-300 text-gray-700 px-12 py-5 pb-10`}>
        <h1 className="title font-semibold pb-3"> Subscribe</h1>
        <div className="input-container flex">
          <Input className="mb-3 bg-primary placeholder-gray-300 text-white rounded-tl-md rounded-bl-md" />
          <Button className="rounded-tr-md rounded-br-md">{'->'}</Button>
        </div>

        <div className="description text-xs">
          Hello, we are Lift Media. Our goal is to translate the positive
          effects from revolutionizing how companies engage with their clients &
          their team.
        </div>
      </div>
    </div>
  );
}

export default Subscribe;
