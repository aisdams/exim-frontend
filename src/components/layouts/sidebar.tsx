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

export default function Sidebar() {
  const [isActive, setIsActive] = useState<number | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [menuIcon, setMenuIcon] = useState('Menu');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSidebarVisible = localStorage.getItem('sidebarVisible');
      setSidebarVisible(storedSidebarVisible === 'true');
      setMenuIcon(storedSidebarVisible === 'true' ? 'Menu' : 'X');

      const storedActiveIndex = localStorage.getItem('activeIndex');
      if (storedActiveIndex) {
        setIsActive(parseInt(storedActiveIndex));
      } else {
        setIsActive(0);
      }
    }
  }, []);

  const handleToggleSidebar = () => {
    const newSidebarVisible = !sidebarVisible;
    setSidebarVisible(newSidebarVisible);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarVisible', JSON.stringify(newSidebarVisible));
      setMenuIcon(newSidebarVisible ? 'Menu' : 'X');
    }
  };

  const router = useRouter();

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

  useEffect(() => {
    const handleResize = () => {
      const isXLScreen = window.innerWidth < 1200;
      if (isXLScreen) {
        setSidebarVisible(false);
        setMenuIcon('Menu');
      } else if (!isXLScreen) {
        setSidebarVisible(true);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    if (!sidebarVisible) {
      setMenuIcon('X');
    }
  }, [sidebarVisible]);

  const handleSidebarItemClick = (idx: number) => {
    setIsActive(idx);
    localStorage.setItem('activeIndex', String(idx));
    const list = document.querySelectorAll(
      '.childOne .childTwo .childThree .childFour'
    );
    list.forEach((item, index) => {
      if (index === idx) {
        item.classList.add('hovered');
      } else {
        item.classList.remove('hovered');
      }
    });
  };

  useEffect(() => {
    const list = document.querySelectorAll(
      '.childOne .childTwo .childThree .childFour'
    );
    const activeIndex = localStorage.getItem('activeIndex');

    list.forEach((item, idx) => {
      if (idx === Number(activeIndex)) {
        item.classList.add('hovered');
      }
      item.addEventListener('click', () => handleSidebarItemClick(idx));
    });

    return () => {
      list.forEach((item, idx) => {
        item.removeEventListener('click', () => handleSidebarItemClick(idx));
      });
    };
  }, []);

  return (
    <div>
      <div
        className={`!z-20" h-screen w-auto bg-blueNav ${
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
            className={`rounded-r-[2rem] bg-blueNav  text-white transition-all duration-500 ease-in-out ${
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
