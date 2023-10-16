import Link from 'next/link';
import Topbar from './topbar';
import Image from 'next/image';
import Logo from 'public/img/logo.png';
import { Menu, X } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import sidebarData from '@/data/sidebar-data';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const [isActive, setIsActive] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [menuIcon, setMenuIcon] = useState('Menu');
  const router = useRouter();

  const handleToggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
    if (sidebarVisible) {
      setMenuIcon('X');
    } else {
      setMenuIcon('Menu');
    }
  };

  useEffect(() => {
    const defaultActiveItem = sidebarData[isActive];
  }, [isActive]);

  useEffect(() => {
    const list = document.querySelectorAll(
      '.childOne .childTwo .childThree .childFour'
    );

    const firstItem = list[0];
    firstItem.classList.add('hovered');

    function activeLink(this: HTMLElement) {
      list.forEach((item) => {
        item.classList.remove('hovered');
      });
      this.classList.add('hovered');
    }

    list.forEach((item) => item.addEventListener('mouseover', activeLink));

    return () => {
      list.forEach((item) => item.removeEventListener('mouseover', activeLink));
    };
  }, []);

  return (
    <div>
      <div
        className={`w-auto h-screen bg-blueNav ${
          sidebarVisible ? 'bg-blueNav rounded-r-[2rem] ' : ''
        }`}
      >
        <div className="flex relative h-screen">
          <div
            className={`bg-blueLight text-white px-7 transition-all ease-in-out duration-500 ${
              sidebarVisible
                ? 'rounded-e-[1.5rem] rounded-s-[1.5rem] '
                : 'rounded-none'
            }`}
          >
            {menuIcon === 'Menu' ? (
              <Menu
                className="absolute top-10 left-4 cursor-pointer"
                size={30}
                onClick={handleToggleSidebar}
              />
            ) : (
              <X
                className="absolute top-10 left-4 cursor-pointer"
                size={30}
                onClick={handleToggleSidebar}
              />
            )}
            <div className="grid absolute top-[6.9rem] gap-[32px] left-2">
              {sidebarData.map((sidebar, idx) => (
                <button
                  key={idx}
                  className={`text-lg w-full flex px-2 ${
                    isActive === idx ? 'border-l-[3px] border-white' : ''
                  }`}
                  onClick={() => setIsActive(idx)}
                >
                  <Link href={sidebar.link}>
                    {' '}
                    {React.createElement(sidebar.icon, {
                      size: 24,
                    })}
                  </Link>
                </button>
              ))}
            </div>
          </div>

          <div
            className={`bg-blueNav dark:bg-[#] rounded-r-[2rem] text-white transition-all ease-in-out duration-500 ${
              sidebarVisible ? '' : 'hidden'
            }`}
          >
            <Image src={Logo} alt="" width={250} />
            <div className="navigation mt-4 grid gap-2">
              {sidebarData.map((sidebar, idx) => (
                <NavigationMenu key={idx} className="childOne">
                  <NavigationMenuList className="childTwo">
                    <NavigationMenuItem className="childThree">
                      <Link href={sidebar.link} className="childFour">
                        <NavigationMenuTrigger
                          className={`text-lg !text-left !justify-normal h-12 dark:hover:!bg-[#111522] dark:text-white hover:!bg-white text-white hover:text-[#4a5ea6] Link rounded-l-full w-[17rem] ${
                            isActive === idx
                              ? 'transition-all ease-linear duration-300 dark:!bg-[#111522] dark:!text-white !bg-white !text-[#4a5ea6]'
                              : ''
                          }`}
                          onClick={() => setIsActive(idx)}
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
    </div>
  );
}
