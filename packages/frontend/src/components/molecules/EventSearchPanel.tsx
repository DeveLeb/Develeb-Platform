import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchPanelProps {
  onSearch: (filters: { title: string; tags: string[]; type: string }) => void;
}

const EventSearchPanel: React.FC<SearchPanelProps> = ({ onSearch }) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [type, setType] = useState('');

  const handleSearch = () => {
    const tagArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    console.log('Search filters:', { title, tags: tagArray, type });
    onSearch({
      title: title.trim(),
      tags: tagArray,
      type: type.trim(),
    });
  };

  return (
    <div className="sm:w-full w-full overflow-x-hidden sm:h-[385px] bg-[var(--light-gray)] sm:p-12 p-4 shadow-lg">
      <div className="sm:ml-10">
        <h1 className="sm:text-[40px] mt-2 text-[30px] font-bold text-[var(--dark-blue)] sm:mb-3 text-left">
          Checkout Our Latest Events
        </h1>
        <p className="text-[20px] text-[var(--dark-blue)] mb-6 text-left">
          Lorem ipsum dolor sit amet consectetur. Ultrices sem est nunc massa.
        </p>
        <div className="flex flex-col sm:flex-row items-end">
          <div className="flex flex-col mb-4 relative w-full sm:w-auto">
            <Input
              type="text"
              id="eventSearch"
              className="sm:w-[600px] placeholder-custom"
              placeholder="What events are you looking for?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--dark-blue)]" />
          </div>

          <div className="flex flex-col mb-4 relative w-full sm:w-auto">
            <Input
              type="text"
              id="tag"
              className="sm:w-[450px] placeholder-custom"
              placeholder="Enter tag(s) (e.g., AI, Machine Learning)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-4 relative w-full sm:w-auto">
            <Input
              type="text"
              id="type"
              className="sm:w-[450px] placeholder-custom"
              placeholder="Enter type (e.g., Online, In-Person)"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div className="flex justify-center items-end w-full">
            <Button
              onClick={handleSearch}
              className="sm:w-[201px] h-[60px] bg-[var(--green)] hover:bg-[var(--dark-blue)] text-white font-bold mb-4 rounded-md text-lg sm:ml-[-4px] sm:border-l-0"
            >
              Search Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventSearchPanel;
