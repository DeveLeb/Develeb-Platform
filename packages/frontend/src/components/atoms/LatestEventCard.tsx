import React from 'react';

const ListItem = ({ text }: { text: string }) => {
  return (
    <div className="flex gap-2 items-center my-1">
      <div className="w-4 h-4 bg-white"></div>
      <div className="font-light text-sm">{text}</div>
    </div>
  );
};

function LatestEventCard() {
  return (
    <div className="bg-main_green relative h-80 rounded-md flex flex-col justify-between p-2">
      <div>
        <img src="/icons/SquareDots.png" alt="dots" className="w-14" />
      </div>
      <div className=" p-5 z-30">
        <h1 className="font-extrabold text-xl">"LAUNCHING OUR FIRST DESIGN SYSTEM"</h1>
        <ul className="">
          <ListItem text="Virtual Meet" />
          <ListItem text="Zoom" />
          <ListItem text="Mar 20, 2024  8:00 PM" />
        </ul>
      </div>
      <div>
        <img src="/icons/RectDots.png" alt="dots" className="w-32" />
      </div>
      <img src="/icons/lines.png" alt="" className="absolute z-10 top-0 right-0 h-full" />
    </div>
  );
}

export default LatestEventCard;
