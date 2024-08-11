import React from 'react';

const ListItem = ({ text }: { text: string }) => {
  return (
    <div className="flex gap-2 items-center my-1">
      <div className="w-4 h-4 bg-white"></div>
      <div className="font-light text-sm">{text}</div>
    </div>
  );
};

interface cardProps {
  title: string;
  list: string[];
}

function LatestEventCard({ title, list }: cardProps) {
  return (
    <div className="bg-main_green relative h-96 rounded-md flex flex-col justify-between p-2 lg:w-96">
      <div>
        <img src="/icons/SquareDots.png" alt="dots" className="w-14" />
      </div>
      <div className=" p-5 z-30">
        <h1 className="font-extrabold text-xl">{title}</h1>
        <ul className="">
          {list.map((item) => <ListItem text={item} />)}
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
