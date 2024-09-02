import React from 'react';

interface HomePageTitleProps {
  title: string;
}

const HomePageTitle: React.FC<HomePageTitleProps> = ({ title }) => {
  return <h1 className="font-semibold text-2xl py-5">{title}</h1>;
};

export default HomePageTitle;
