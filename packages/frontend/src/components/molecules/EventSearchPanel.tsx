import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';

interface SearchPanelProps {
  onSearch: () => void;
}

const EventSearchPanel: React.FC<SearchPanelProps> = ({ onSearch }) => {
  return (
    <div className="w-[2000px] h-[385px] bg-gray-200 p-10 shadow-lg flex justify-center">
      <div className="max-w-[1400px] w-full flex flex-col justify-center">
        <h1 className="text-[40px] font-bold text-white mb-3 text-left">Checkout Our Latest Events</h1>
        <p className="text-[20px] text-white mb-6 text-left">
          Lorem ipsum dolor sit amet consectetur. Ultrices sem est nunc massa.
        </p>
        <div className="flex items-end">
          <div className="flex flex-col mb-4 relative">
            <input
              type="text"
              id="eventSearch"
              className="w-[950px] h-[60px] border border-gray-500 p-2 pl-10 focus:outline-none focus:ring-2"
              style={{
                '--tw-ring-color': '#01C38D',
              }}
              placeholder="What events are you looking for?"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          <div className="flex flex-col mb-4 relative">
            <input
              type="text"
              id="location"
              className="w-[400px] h-[60px] border border-gray-500 p-2 pl-10 focus:outline-none focus:ring-2"
              style={{
                '--tw-ring-color': '#01C38D',
              }}
              placeholder="Enter location"
            />
            <FaLocationDot className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          <Button
            onClick={onSearch}
            className="h-[60px] w-[200px] bg-main-green hover:bg-main-darkGreen text-white font-bold mb-4"
          >
            Search Event
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventSearchPanel;
