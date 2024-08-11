'use client';
import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import NavBar from './NavBar';
import { Button } from '../atoms/button';
import Link from 'next/link';
function Header() {
  const [openBar, setOpenBar] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  let closeBar = () => setOpenBar(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 820);
    };

    window.addEventListener('resize', handleResize);
  }, []);
  return (
    <header className="flex justify-between items-center bg-primary sm:px-10 sm:py-3">
      <div className="text-secondary border border-border px-2 py-1">Logo</div>
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
        <div className="flex justify-between items-center text-secondary gap-7">
          <Link href="#">Jobs</Link>
          <Link href="#">Events</Link>
          <Link href="#">Companies</Link>
          <Link href="#">About Us</Link>
          <Link href="#">Contact Us</Link>

          <div className="border-l-2 pl-7 flex gap-5">
            <Button className="text-main_green border-2 border-main_green bg-transparent rounded-md">Login</Button>
            <Button className="text-secondary bg-main_green rounded-md hover:bg-main-green">Sign Up</Button>
          </div>
        </div>
      )}

      {openBar && <NavBar theme={'white'} closeBar={closeBar} />}
    </header>
  );
}

export default Header;
