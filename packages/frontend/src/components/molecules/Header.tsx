'use client';
import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import NavBar from './NavBar';
function Header() {
  const [openBar, setOpenBar] = useState(false);
  let closeBar = () => setOpenBar(false);
  return (
    <header className="flex justify-between items-center p-4  mb-40 bg-primary sm:px-20 sm:py-3">
      <div className="text-secondary border border-border px-2 py-1">Logo</div>
      <div className="px-2 py-2 rounded-full hover:bg-white/50 transition-colors cursor-pointer">
        <FaBars
          color="#ffff"
          size={20}
          onClick={() => {
            setOpenBar(!openBar);
          }}
        />
      </div>

      {openBar && <NavBar theme={'white'} closeBar={closeBar} />}
    </header>
  );
}

export default Header;
