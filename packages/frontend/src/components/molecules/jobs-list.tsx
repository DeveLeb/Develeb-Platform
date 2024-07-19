import React from 'react';
import JobCard from './job-card';
import { dummy_jobs } from '@/utils/jobs-dummy-data';
function JobsList() {
  return (
    <div className="jobs-list bg-gray-100 p-5">
      <div className="jobs-quantity text-primary text-2xl font-bold py-3">{dummy_jobs.length} Jobs</div>
      {dummy_jobs.map((job, key) => (
        <JobCard jobData={job} key={key} />
      ))}
    </div>
  );
}

export default JobsList;
