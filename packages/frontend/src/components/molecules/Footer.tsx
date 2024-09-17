import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import LinkSection from '../atoms/LinkSection';
import Subscribe from '../atoms/Subscribe';
import { FaLinkedinIn } from 'react-icons/fa';

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
    element: (
      <Link href="https://www.linkedin.com/company/develeb/" target="_blank" rel="noopener noreferrer">
        <FaLinkedinIn width={18} height={18} />
      </Link>
    ),
  },
];

function Footer() {
  return (
    <footer className="bg-[var(--dark-blue)] text-[var(--white)] text-sm p-10 xl:px-20 max-w-[2000px]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-stretch w-full gap-8 lg:gap-0 pb-10 border-b border-[var(--light-gray)]">
        <div className="flex flex-wrap gap-6 w-full lg:w-[65%]">
          {links_sections.map((section: { title: string; links: string[] }, key) => (
            <LinkSection section={section} key={key} />
          ))}
        </div>

        <Subscribe className="w-full lg:w-[30%]" />
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-center w-full pt-10 lg:pt-5 gap-8">
        <div className="px-2 py-1 text-center">
          <Image src="/images/Logo.png" alt="logo" width={70} height={70} />
        </div>

        <ul className="flex gap-8">
          <li>Terms</li>
          <li>Privacy</li>
          <li>Cookies</li>
        </ul>
        <ul className="flex gap-8 justify-center">
          {social_media.map((value: { element: any }, i) => (
            <li key={i} className="border border-gray-300 rounded-full h-10 w-10 flex justify-center items-center">
              {value.element}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
