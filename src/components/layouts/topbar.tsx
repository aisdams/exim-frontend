import React, { useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import Avatar from 'public/img/avatar.png';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  ToggleLeft,
  ToggleRight,
  Bell,
  Moon,
  Sun,
  Maximize,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Topbar() {
  const { setTheme } = useTheme();

  function toggleFullScreen() {
    const elem = document.documentElement as HTMLElement;
    if (elem.requestFullscreen) {
      elem
        .requestFullscreen()
        .then(() => {
          console.log('Success');
        })
        .catch((error) => {
          console.error('Error entering fullscreen mode:', error);
        });
    }
  }

  useEffect(() => {
    const maximizeButton = document.querySelector('.fullscreen-button');
    maximizeButton?.addEventListener('click', toggleFullScreen);

    return () => {
      maximizeButton?.removeEventListener('click', toggleFullScreen);
    };
  });
  return (
    <div className="p-4 flex justify-between items-center shadow-2xl">
      <div className="flex items-center relative">
        <Input
          type="search"
          placeholder="Search....."
          className="border border-gray-400 rounded-full px-10 py-2 mr-4 w-full dark:bg-secondDarkBlue"
        />
        <div className="text-gray-600 absolute right-8 dark:text-white">
          <Search className="w-5 h-5" />
        </div>
      </div>

      <div className="flex gap-4 items-center text-graySecondary dark:text-white">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="dark:bg-darkBlue">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark:text-black">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div
          className="dark:text-white cursor-pointer fullscreen-button"
          onClick={toggleFullScreen}
        >
          <Maximize />
        </div>

        <div className="flex relative">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2">
              <Bell />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-lg rounded-lg w-40 mr-5 dark:text-black">
              <DropdownMenuLabel>News</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="absolute right-1 bullet rounded-full w-2 h-2 bg-red-600"></div>
        </div>

        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 dark:text-white">
              <Image
                src={Avatar}
                alt=""
                className="rounded-full w-9"
                width={36}
                height={36}
              />
              Admin
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-lg rounded-lg w-40 mr-5 dark:text-black">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
