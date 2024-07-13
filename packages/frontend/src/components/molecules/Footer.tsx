import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LinkSection from '../atoms/LinkSection';
import Subscribe from '../atoms/Subscribe';

const links_sections = [
  {
    title: 'Product',
    links: ['Employee database', 'Payroll', 'Absences', 'Time tracking'],
  },
  {
    title: 'Information',
    links: ['FAQ', 'Blog', 'Support'],
  },
  {
    title: 'Company',
    links: ['About us', 'Careers', 'Contact us', 'Lift Media'],
  },
];
const social_media = [
  {
    element: 'in',
  },
  {
    element: 'f',
  },
  {
    element: <Image src="/icons/twitter-icon.png" width={18} height={18} alt="twt" />,
  },
];

function Footer() {
  return (
    <footer className="flex flex-wrap flex-col bg-primary text-white text-sm p-10 ml:pb-20 ml:flex-row xl:px-20 max-w-[2000px] m-auto">
      <div className="links-container flex flex-col justify-center gap-6 order-2 pb-8 sm:flex-row ml:w-[65%] ml:gap-0 ml:border-b ml:border-gray-500 ml:mb-[30px] ml:pb-0 ml:order-none">
        {links_sections.map((section: { title: string; links: string[] }, key) => {
          return <LinkSection section={section} key={key} />;
        })}
      </div>
      <Subscribe className="order-5 ml:w-[35%]  ml:order-none ml:pb-[40px] ml:mb-[30px] ml:border-b ml:border-gray-500" />
      <div className="mb-4 border border-border px-2 py-1 text-center order-1 ml:mb-0 ml:order-none ">logo</div>
      <ul className="flex justify-center pb-6 items-center gap-8 order-3  ml:pb-0  ml:flex-grow ml:basis-[20%]  ml:order-none xl:gap-20">
        <li>Terms</li>
        <li>Privacy</li>
        <li>cookies</li>
      </ul>
      <ul className="social-container border-b-2 border-gray-500 ml:border-none pb-3 mb-4 ml:mb-0 ml:pb-0 gap-16 ml:gap-0 justify-center ml:justify-between items-center flex ml:flex-grow text-md order-4 ml:order-none">
        {social_media.map((value) => (
          <Link href={'#'} className="border border-gray-300 rounded-full h-10 w-10 flex justify-center items-center">
            {value.element}
          </Link>
        ))}
      </ul>
    </footer>
  );
}

export default Footer;
