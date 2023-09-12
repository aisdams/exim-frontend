import React, { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import Logo from 'public/img/logo.png';
import Link from 'next/link';
import sidebarData from '@/data/sidebar-data';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';
import Topbar from './topbar';

export default function Sidebar() {
  const [isActive, setIsActive] = useState('');

  const handleSetActive = (title: string) => {
    setIsActive(title);
  };

  return (
    <div className="w-[18rem] h-screen bg-blueNav rounded-r-[2rem] text-white">
      <div className="flex relative">
        <div className="bg-blueLight h-screen px-7 rounded-e-[1.5rem] rounded-s-[1.5rem]">
          <div className="grid absolute top-[6.2rem] gap-[25px] left-2">
            {sidebarData.map((sidebar, idx) => (
              <button
                key={idx}
                className={`text-lg w-full flex px-2 ${
                  isActive === sidebar.title
                    ? 'border-l-[3px] border-white'
                    : ''
                }`}
                onClick={() => handleSetActive(sidebar.title)}
              >
                {React.createElement(sidebar.icon, {
                  size: 24,
                })}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Image src={Logo} alt="" width={250} />
          <div className="mt-4 grid gap-2">
            {sidebarData.map((sidebar, idx) => (
              <NavigationMenu key={idx}>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href={sidebar.link}>
                      <NavigationMenuTrigger
                        className={`text-lg w-[15rem] !text-left !justify-normal ${
                          isActive === sidebar.title
                            ? 'bg-white rounded-l-full rounded-r-full text-[#4a5ea6] transition-all ease-linear duration-300'
                            : ''
                        }`}
                        onClick={() => handleSetActive(sidebar.title)}
                      >
                        <span className="!text-left">{sidebar.title}</span>
                      </NavigationMenuTrigger>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
