import React from 'react';

import HomePageTitle from '../atoms/homePageTitle';
function TopPartners() {
  const images = Array.from({ length: 20 }, (_, index) => index + 1);

  return (
    <div className="px-10 py-5 lg:flex lg:gap-10 justify-evenly border-b-2 border-gray-500 mb-10">
      <div className="flex items-center gap-5">
        <HomePageTitle title={'Top Partners'} />
        <button className="bg-primary w-8 p-1 flex items-center">
          <img src="/icons/Arrow.svg" alt="arrow" />
        </button>
      </div>

      <div className="flex gap-5 overflow-scroll py-5 lg:w-[70%]">
        {images.map((image) => (
          <img key={image} src="/images/logo 2.png" alt={`Image ${image}`} className="w-[100px]" />
        ))}
      </div>
    </div>
  );
}

export default TopPartners;
