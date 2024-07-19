import React from 'react';
import SearchJobComponent from '../molecules/search-job-component';
import JobsList from '../molecules/jobs-list';
function JobsPageComponent() {
  return (
    <div className="page-container text-primary">
      <div className="top-section p-5 sm:px-9 sm:py-4 md:px-24 md:py-8 ">
        <div className="page-title mb-3 font-bold text-3xl sm:text-5xl md:text-6xl">Find your new job today</div>
        <div className="mb-3">
          Thousands of jobs in the computer, engineering and technology sectors are waiting for you.
        </div>
        <SearchJobComponent />
      </div>
      <JobsList />
    </div>
  );
}

export default JobsPageComponent;
