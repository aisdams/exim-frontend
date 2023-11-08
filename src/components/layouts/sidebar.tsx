import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';
import Logo from 'public/img/logo_neelo.png';

import sidebarData from '@/data/sidebar-data';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import Topbar from './topbar';

export default function Sidebar() {
  const [isActive, setIsActive] = useState(0);
  // const [isActive, setIsActive] = useState(-1);
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

  const handleSidebarItemClick = (idx: any) => {
    setIsActive(idx);
    localStorage.setItem('activeIndex', String(idx));
  };

  useEffect(() => {
    const storedIndex = localStorage.getItem('activeIndex');
    if (storedIndex !== null) {
      setIsActive(Number(storedIndex));
    } else {
      setIsActive(0);
    }
  }, []);

  useEffect(() => {
    if (router.asPath !== '/') {
      const activeIndex = sidebarData.findIndex(
        (item) => router.asPath === item.link
      );
      if (activeIndex !== -1) {
        setIsActive(activeIndex);
        localStorage.setItem('activeIndex', String(activeIndex));
      }
    }
  }, [router.asPath]);

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
    <div className="!z-[20]">
      <div
        className={`h-screen w-auto bg-blueNav ${
          sidebarVisible ? 'rounded-r-[2rem] bg-blueNav ' : ''
        }`}
      >
        <div className="relative flex h-screen">
          <div
            className={`bg-blueLight px-7 text-white transition-all duration-500 ease-in-out ${
              sidebarVisible
                ? 'rounded-e-[1.5rem] rounded-s-[1.5rem] '
                : 'rounded-none'
            }`}
          >
            {menuIcon === 'Menu' ? (
              <Menu
                className="absolute left-4 top-10 cursor-pointer"
                size={30}
                onClick={handleToggleSidebar}
              />
            ) : (
              <X
                className="absolute left-4 top-10 cursor-pointer"
                size={30}
                onClick={handleToggleSidebar}
              />
            )}

            <div className="absolute left-2 top-[6.9rem] grid gap-[32px]">
              {sidebarData.map((sidebar, idx) => (
                <button
                  key={idx}
                  className={`flex w-full px-2 text-lg ${
                    isActive === idx ? 'border-l-[3px] border-white' : ''
                  }`}
                  onClick={() => handleSidebarItemClick(idx)}
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
            className={`rounded-r-[2rem] bg-blueNav text-white transition-all duration-500 ease-in-out dark:bg-[#] ${
              sidebarVisible ? '' : 'hidden'
            }`}
          >
            <Image src={Logo} alt="" width={250} />
            <div className="navigation lap- !z-0 mt-4 grid gap-2">
              {sidebarData.map((sidebar, idx) => (
                <NavigationMenu key={idx} className="childOne">
                  <NavigationMenuList className="childTwo">
                    <NavigationMenuItem className="childThree">
                      <Link href={sidebar.link} className="childFour">
                        <NavigationMenuTrigger
                          className={`Link h-12 w-[17rem] !justify-normal rounded-l-full !text-left text-lg text-white hover:!bg-white hover:text-[#4a5ea6] dark:text-white dark:hover:!bg-[#262e4b] ${
                            isActive === idx
                              ? '!bg-white !text-[#4a5ea6] transition-all duration-300 ease-linear dark:!bg-[#262e4b] dark:!text-white'
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
