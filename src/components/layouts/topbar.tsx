import React from 'react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import Avatar from 'public/img/avatar.png';
import { Button } from '@/components/ui/button';
import { Search, ToggleLeft, ToggleRight, Bell, Moon, Sun } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Topbar() {
  const { setTheme } = useTheme();
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center relative">
        <Input
          type="search"
          placeholder="Search....."
          className="border border-gray-400 rounded-full px-4 py-2 mr-4 w-full"
        />
        <div className="text-gray-600 absolute right-8">
          <Search className="w-5 h-5" />
        </div>
      </div>

      <div className="flex gap-4 items-center text-graySecondary">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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

        <div className="flex relative">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2">
              <Bell />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-lg rounded-lg">
              <DropdownMenuLabel>News</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="absolute right-0 bullet rounded-full w-2 h-2 bg-red-600 hidden"></div>
        </div>
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2">
              <Image
                src={Avatar}
                alt=""
                className="rounded-full w-9"
                width={36}
                height={36}
              />
              Admin
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-lg rounded-lg">
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
