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
  const [sidebarVisible, setSidebarVisible] = useState(
    localStorage.getItem('sidebarVisible') === 'true'
  );
  const [menuIcon, setMenuIcon] = useState(
    localStorage.getItem('sidebarVisible') === 'true' ? 'X' : 'Menu'
  );

  const router = useRouter();

  useEffect(() => {
    const storedActiveIndex = localStorage.getItem('activeIndex');
    if (storedActiveIndex) {
      setIsActive(parseInt(storedActiveIndex));
    } else {
      setIsActive(0);
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      const currentRoute = router.pathname;
      const activeIndex = sidebarData.findIndex(
        (item) => item.link === currentRoute
      );
      if (activeIndex !== -1) {
        setIsActive(activeIndex);
        localStorage.setItem('activeIndex', String(activeIndex));
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.pathname, sidebarData]);

  const handleToggleSidebar = () => {
    const newSidebarVisible = !sidebarVisible;
    setSidebarVisible(newSidebarVisible);
    localStorage.setItem('sidebarVisible', JSON.stringify(newSidebarVisible));
    setMenuIcon(newSidebarVisible ? 'Menu' : 'X');
  };

  useEffect(() => {
    if (!sidebarVisible) {
      setMenuIcon('X');
    }
  }, [sidebarVisible]);

  const handleSidebarItemClick = (idx: any) => {
    setIsActive(idx);
    localStorage.setItem('activeIndex', String(idx));
  };

  useEffect(() => {
    const defaultActiveItem = sidebarData[isActive];
  }, localStorage[isActive]);

  useEffect(() => {
    const list = document.querySelectorAll(
      '.childOne .childTwo .childThree .childFour'
    );

    let firstItem = list[0];
    const isClicked = localStorage.getItem('isClicked');

    if (!isClicked) {
      firstItem.classList.add('hovered');
    }

    function activeLink(this: HTMLElement) {
      list.forEach((item) => {
        item.classList.remove('hovered');
      });
      this.classList.add('hovered');
      localStorage.setItem('isClicked', 'true');
    }

    list.forEach((item) => item.addEventListener('click', activeLink));

    return () => {
      list.forEach((item) => item.removeEventListener('click', activeLink));
    };
  }, []);

  return (
    <div className="!z-[5]">
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

            <div className="absolute left-2 top-[8rem] grid gap-[32px]">
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
            <Image
              src={Logo}
              alt=""
              width={150}
              className="ml-4 pt-10 brightness-0 invert-[1]"
            />
            <div className="navigation lap- !z-0 mt-7 grid gap-2">
              {sidebarData.map((sidebar, idx) => (
                <NavigationMenu key={idx} className="childOne">
                  <NavigationMenuList className="childTwo">
                    <NavigationMenuItem className="childThree">
                      <Link href={sidebar.link} className="childFour">
                        <NavigationMenuTrigger
                          className={`Link h-12 w-[14rem] !justify-normal rounded-l-full !text-left text-lg text-white hover:text-white dark:text-white ${
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

//
