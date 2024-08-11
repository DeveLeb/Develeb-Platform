import React from 'react';
import { useEffect, useState } from 'react';

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
}
function LatestJobCard({ title, jobDetails }: cardProps) {
  return (
    <div className="relative bg-primary p-5 text-white rounded-md flex flex-col justify-between h-96 lg:w-96">
      <div>
        <div className="flex justify-between items-center mb-3 font-light">
          <div className="bg-main_green text-primary rounded-md p-1">{jobDetails.category}</div>
          <div>{jobDetails.date}</div>
        </div>
        <h1 className="font-extrabold text-2xl">{title}</h1>
      </div>
      <div className="font-light leading-8">
        <div>{jobDetails.companyName}</div>
        <div>{jobDetails.location}</div>
        <div>{jobDetails.salary}</div>
      </div>
      <div className="text-primary bg-white p-1 w-32 flex items-center rounded-md">
        <div className="text-sm">Job Details</div>
        <img src="/icons/arrow.svg" alt="" className="-rotate-45 w-9" />
      </div>

      <img
        src="/images/logo 2.png"
        alt="logo"
        className="absolute w-28 bottom-24 right-10 shadow-lg shadow-main_green"
      />
    </div>
  );
}

export default LatestJobCard;
