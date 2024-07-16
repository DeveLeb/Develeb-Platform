import React from 'react';

import { Button } from '@/components/ui/button';

interface SearchPanelProps {
  onSearch: () => void;
}

const EventSearchPanel: React.FC<SearchPanelProps> = ({ onSearch }) => {
  return (
    <div className="w-[2000px] h-[385px] bg-gray-300 p-10 shadow-lg flex justify-center">
      <div className="max-w-[1400px] w-full flex flex-col justify-center">
        <h1 className="text-[40px] font-bold text-white mb-3 text-left">Checkout Our Latest Events</h1>
        <p className="text-[20px] text-white mb-6 text-left">
          Lorem ipsum dolor sit amet consectetur. Ultrices sem est nunc massa.
        </p>
        <div className="flex items-end">
          <div className="flex flex-col mb-4">
            <input
              type="text"
              id="eventSearch"
              className="w-[950px] h-[60px] border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What events are you looking for?"
            />
          </div>
          
          <div className="flex flex-col mb-4">
            <input
              type="text"
              id="location"
              className="w-[400px] h-[60px] border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter location"
            />
          </div>
          
          <Button onClick={onSearch} className="h-[60px] bg-gray-800 hover:bg-gray-600 text-white font-bold mb-4">
            Search Event
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventSearchPanel;
