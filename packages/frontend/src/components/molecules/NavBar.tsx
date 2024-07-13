import React from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link';
import { FaBars } from 'react-icons/fa';

let pages = [
  { title: 'Home', path: '#' },
  { title: 'Jobs', path: '#' },
  { title: 'Events', path: '#' },
  { title: 'Contact us', path: '#' },
];
interface NavBarProps {
  theme: string;
  closeBar: () => void;
}
function NavBarLayout({ theme, closeBar }: NavBarProps) {
  const selected = 'Home';
  return (
    <div className={`absolute top-0 right-0 left-0 bottom-0 bg-white/90`}>
      <header className="flex justify-between items-center p-4 sm:px-20 sm:py-3">
        <div className="border-2 border-black font-bold px-2 py-1">Logo</div>
        <div className="px-2 py-2 rounded-full hover:bg-black/40 hover:text-background transition-colors cursor-pointer">
          <FaBars size={20} onClick={closeBar} />
        </div>
      </header>
      <nav className="flex flex-col items-end px-8 pt-10 sm:px-16 ">
        {pages.map((item: { title: string; path: string }) => {
          return (
            <div
              className={`${selected === item.title ? 'text-5xl sm:text-7xl font-extrabold' : 'text-3xl sm:text-4xl font-bold'}`}
              key={item.title}
            >
              <Link href={item.path}>{item.title}</Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

function NavBar(props: NavBarProps) {
  const portalElement = document.getElementById('portal');
  return portalElement ? ReactDOM.createPortal(<NavBarLayout {...props} />, portalElement) : null;
}
export default NavBar;
