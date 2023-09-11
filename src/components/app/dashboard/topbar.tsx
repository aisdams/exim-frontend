import React from 'react';
import { Search, ToggleLeft, ToggleRight, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Avatar from 'public/img/avatar.png';
import Image from 'next/image';

export default function Topbar() {
  return (
    <div className="flex justify-between gap-5 mx-10">
      <div className="flex relative">
        <input
          type="search"
          placeholder="Search....."
          className="border border-gray-400 rounded-full px-10 py-1"
        />
        <div className="absolute right-3 top-[5px] text-gray-600">
          <Search className="w-5 h-5" />
        </div>
      </div>

      <div className="flex gap-5 items-center">
        <ToggleLeft />
        <Bell />
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3">
              <Image
                src={Avatar}
                alt=""
                className="rounded-full w-9 relative"
              />
              Admin
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-[2px_10px_31px_0px_rgba(0,0,0,0.5)] rounded-lg">
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
