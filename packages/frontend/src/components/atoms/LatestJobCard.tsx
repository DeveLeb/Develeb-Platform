import React from 'react';

interface jobDetails {
  category: string;
  date: string;
  companyName: string;
  location: string;
  salary: string;
}
interface cardProps {
  title: string;
  jobDetails: jobDetails;
  link: string;
  imageSrc: string;
}
function LatestJobCard({ title, jobDetails, link, imageSrc }: cardProps) {
  return (
    <div className="relative bg-[var(--dark-blue)] p-5 text-[var(--white)] rounded-md flex flex-col justify-between h-96 lg:w-96">
      <div>
        <div className="flex justify-between items-center mb-3 font-light">
          <div className="bg-[var(--green)] text-[var(--dark-blue)] rounded-md p-1">{jobDetails.category}</div>
          <div>{jobDetails.date}</div>
        </div>
        <h1 className="font-extrabold text-2xl">{title}</h1>
      </div>
      <div className="font-light leading-8">
        <div>{jobDetails.companyName}</div>
        <div>{jobDetails.location}</div>
        <div>{jobDetails.salary}</div>
      </div>
      <a
        href={link}
        className="text-[var(--dark-blue)] bg-[var(--white)] p-1 w-32 flex items-center rounded-md"
      >
        <div className="text-sm">Job Details</div>
        <img src="/icons/arrow.svg" alt="" className="-rotate-45 w-9" />
      </a>

      <img
        src={imageSrc}
        alt={jobDetails.companyName}
        className="absolute w-28 bottom-24 right-10 shadow-lg shadow-[var(--green)]"
      />
    </div>
  );
}

export default LatestJobCard;
