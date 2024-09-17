'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';

import { Button } from '../atoms/button';
import NavBar from './NavBar';
function Header() {
  const [openBar, setOpenBar] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  const closeBar = () => setOpenBar(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 820);
    };

    window.addEventListener('resize', handleResize);
  }, []);
  return (
    <header className="flex justify-between items-center bg-[var(--dark-blue)] sm:px-10 sm:py-3">
      <div className="text-[var(--white)]">
      <img src="/images/Logo.png" alt="logo" className="w-14" />
      </div>
      {isMobileScreen ? (
        <div className="px-2 py-2 rounded-full hover:bg-white/50 transition-colors cursor-pointer">
          <FaBars
            color="#ffff"
            size={20}
            onClick={() => {
              setOpenBar(!openBar);
            }}
          />
        </div>
      ) : (
        <div className="flex justify-between items-center text-[var(--white)] gap-7">
          <Link href="jobs">Jobs</Link>
          <Link href="events">Events</Link>
          <Link href="#">Companies</Link>
          <Link href="#">About Us</Link>
          <Link href="#">Contact Us</Link>

          <div className="border-l-2 pl-7 flex gap-5">
            <Button className="text-[var(--green)] border-2 border-[var(--green)] bg-transparent rounded-md">Login</Button>
            <Button className="text-[var(--white)] bg-[var(--green)] rounded-md hover:bg-[var(--dark-blue)]">Sign Up</Button>
          </div>
        </div>
      )}

      {openBar && <NavBar theme={'white'} closeBar={closeBar} />}
    </header>
  );
}

export default Header;
