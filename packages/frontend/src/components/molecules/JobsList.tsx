import React from 'react';
import JobCard from './JobCard';
import { dummy_jobs } from '@/utils/JobsDummyData';
function JobsList() {
  return (
    <div className="jobs-list bg-[var(--white)] p-5">
      <div className="jobs-quantity text-var[(--dark-blue)] text-2xl font-bold py-3">{dummy_jobs.length} Jobs</div>
      {dummy_jobs.map((job, key) => (
        <JobCard jobData={job} key={key} />
      ))}
    </div>
  );
}

export default JobsList;