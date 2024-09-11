import Link from 'next/link';
import React from 'react';

function LinkSection({ section }: { section: { title: string; links: string[] } }) {
  return (
    <ul className="w-100% flex flex-col items-center ml:items-stretch list-none flex-grow p-0 m-0 text-gray-300 leading-6">
      <li className="title text-white font-bold pb-1.5">{section.title}</li>
      {section.links.map((link, key) => (
        <li key={key}>
          <Link href={'#'}>{link}</Link>
        </li>
      ))}
    </ul>
  );
}

export default LinkSection;
