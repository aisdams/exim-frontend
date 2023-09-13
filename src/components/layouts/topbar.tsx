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
    <div className="bg-white sticky shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center">
        <input
          type="search"
          placeholder="Search....."
          className="border border-gray-400 rounded-full px-4 py-2 mr-4"
        />
        <div className="text-gray-600">
          <Search className="w-5 h-5" />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <ToggleLeft />
        <Bell />
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
