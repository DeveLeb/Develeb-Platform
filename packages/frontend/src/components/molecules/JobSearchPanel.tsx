import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// interface SearchPanelProps {
//   onSearch: (filters: { title: string; tags: string[]; type: string }) => void;
// }

const JobSearchPanel: React.FC<JobPanelProps> = () => {
  //   const [title, setTitle] = useState('');
  //   const [tags, setTags] = useState('');
  //   const [type, setType] = useState('');

  //   const handleSearch = () => {
  //     const tagArray = tags
  //       .split(',')
  //       .map((tag) => tag.trim())
  //       .filter((tag) => tag.length > 0);
  //     console.log('Search filters:', { title, tags: tagArray, type });
  //     onSearch({
  //       title: title.trim(),
  //       tags: tagArray,
  //       type: type.trim(),
  //     });
  //   };

  return (
    <div className="sm:w-full w-full overflow-x-hidden sm:h-[385px] bg-[var(--white)] sm:p-12 p-4 shadow-lg">
      <div className="sm:ml-10">
        <h1 className="sm:text-[40px] mt-2 text-[30px] font-bold text-[var(--dark-blue)] sm:mb-3 text-left">
          Find Your New Job Today
        </h1>
        <p className="text-[20px] text-[var(--dark-blue)] mb-6 text-left">
          Thousands of jobs in the computer, engineering and technology sectors are waiting for you.
        </p>
        <div className="flex flex-col sm:flex-row items-end">
          <div className="flex flex-col mb-4 relative w-full sm:w-auto">
            <Input
              type="text"
              id="jobSearch"
              className="sm:w-[950px] placeholder-custom border-opacity-30"
              placeholder="What jobs are you looking for?"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--dark-blue)]" />
          </div>

          <div className="flex flex-col mb-4 relative w-full sm:w-auto">
            <Input type="text" id="location" className="sm:w-[530px] placeholder-custom" placeholder="Location" />
            <FaLocationDot className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--dark-blue)]" />
          </div>
          <div className="flex justify-center items-end w-full">
            <Button className="sm:w-[201px] h-[60px] bg-[var(--green)] hover:bg-[var(--dark-blue)] text-white font-bold mb-4 rounded-md text-lg sm:ml-[-4px] sm:border-l-0">
              Search Job
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default JobSearchPanel;
