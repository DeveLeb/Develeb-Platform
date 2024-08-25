import Image from 'next/image';
import React from 'react';
import { FaCalendarAlt, FaClock, FaDollarSign, FaMapMarkerAlt } from 'react-icons/fa';

import { Job } from '@/types/Job';
import { getTimePassedSince } from '@/utils/getTimePassedSince';

const job_details = [
  { key: 'location', icon: <FaMapMarkerAlt /> },
  { key: 'type_title', icon: <FaClock /> },
  { key: 'salary', icon: <FaDollarSign /> },
  { key: 'posted_at', icon: <FaCalendarAlt />, format: getTimePassedSince },
];

function JobCard({ jobData }: { jobData: Job }) {
  return (
    <div className="job-card bg-card flex gap-5 p-5 mb-8 cursor-pointer rounded-xl border border-border shadow-sm transform transition-transform duration-300 hover:scale-105 hover:bg-[var(--light-gray)]">
      <div>
        <Image src={jobData.company_icon} height={72} width={72} alt="company icon" />
      </div>
      <div className="job-info">
        <div className="mb-1 text-card-foreground">{jobData.company_name}</div>
        <div className="job-title font-semibold text-2xl mb-3 text-card-foreground">{jobData.title}</div>
        <div className="job-details flex gap-4 pb-2 text-card-foreground">
          {job_details.map((detail, i) => (
            <div className="flex items-center" key={i}>
              {detail.icon}
              <span className="ml-2">
                {detail.format ? detail.format(jobData[detail.key as keyof Job]) : jobData[detail.key as keyof Job]}
              </span>
              {i !== 3 && <div className="text-xl ml-4">.</div>}
            </div>
          ))}
        </div>
        <div className="text-card-foreground">{jobData.description}</div>
      </div>
    </div>
  );
}

export default JobCard;
