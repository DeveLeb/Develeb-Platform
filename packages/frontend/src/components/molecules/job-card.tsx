import { Job } from '@/types/job';
import { getTimePassedSince } from '@/utils/get-time-passed-since';
import Image from 'next/image';
import React from 'react';
import { FaMapMarkerAlt, FaClock, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
const job_details = [
  { key: 'location', icon: <FaMapMarkerAlt /> },
  { key: 'type_title', icon: <FaClock /> },
  { key: 'salary', icon: <FaDollarSign /> },
  { key: 'posted_at', icon: <FaCalendarAlt />, format: getTimePassedSince },
];
function JobCard({ jobData }: { jobData: Job }) {
  return (
    <div className="job-card  bg-white flex gap-5 p-5 mb-8 cursor-pointer rounded-xl border border-primary/70 text-primary shadow-sm hover:bg-primary/10 hover:shadow-md transition-colors">
      <div>
        <Image src={jobData.company_icon} height={72} width={72} alt="company icon" />
      </div>
      <div className="job-info">
        <div className="mb-1">{jobData.company_name}</div>
        <div className="job-title font-[600] text-2xl mb-3">{jobData.title}</div>
        <div className="job-details flex gap-4 pb-2">
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
        <div>{jobData.description}</div>
      </div>
    </div>
  );
}

export default JobCard;
