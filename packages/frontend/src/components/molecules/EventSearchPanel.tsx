import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';

interface SearchPanelProps {
  onSearch: () => void;
}

const EventSearchPanel: React.FC<SearchPanelProps> = ({ onSearch }) => {
  return (
    <div className="sm:w-full w-full overflow-x-hidden sm:h-[385px] bg-gray-200 sm:p-12 p-4 shadow-lg">
      <div className="sm:ml-10">
        <h1 className="sm:text-[40px] mt-2 text-[30px] font-bold text-main-darkBlue sm:mb-3 text-left">
          Checkout Our Latest Events
        </h1>
        <p className="text-[20px] text-main-darkBlue mb-6 text-left">
          Lorem ipsum dolor sit amet consectetur. Ultrices sem est nunc massa.
        </p>
        <div className="flex flex-col sm:flex-row items-end">
          <div className="flex flex-col mb-4 relative w-full sm:w-auto">
            <input
              type="text"
              id="eventSearch"
              className="w-full sm:w-[950px] h-[60px] border border-main-darkBlue-300 p-2 pl-10 focus:outline-none focus:ring-2 placeholder-custom"
              style={{
                '--tw-ring-color': '#01C38D',
              }}
              placeholder="What events are you looking for?"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-main-darkBlue" />
          </div>

          <div className="flex flex-col mb-4 relative w-full sm:w-auto">
            <input
              type="text"
              id="location"
              className="w-full sm:w-[450px] h-[60px] border border-main-darkBlue-300 p-2 pl-10 focus:outline-none focus:ring-2 placeholder-custom"
              style={{
                '--tw-ring-color': '#01C38D',
              }}
              placeholder="Enter location"
            />
            <FaLocationDot className="absolute left-3 top-1/2 transform -translate-y-1/2 text-main-darkBlue" />
          </div>

          <Button
            onClick={onSearch}
            className="w-full sm:w-[201px] h-[60px] bg-main-green hover:bg-main-darkGreen text-white font-bold mb-4 rounded-md text-lg"
          >
            Search Event
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventSearchPanel;
