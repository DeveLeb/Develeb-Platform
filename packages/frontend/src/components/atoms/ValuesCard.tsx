import React from 'react';

function ValuesCard() {
  return (
    <div className="bg-[var(--dark-blue)] text-[var(--white)] flex items-center justify-between rounded-lg p-8 w-full max-w-xl h-38 mb-4">
      <h1 className="text-[var(--green)] text-4xl font-bold flex-shrink-0">240%</h1>
      <div className="flex flex-col items-start justify-center text-left pl-8">
        <h2 className="text-2xl">Lorem ipsum.</h2>
        <div className="font-light text-base text-[var(--light-gray)]">
          Lorem ipsum dolor sit amet consectetur adipisicing.
        </div>
      </div>
    </div>
  );
}

export default ValuesCard;
