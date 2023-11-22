import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Bell,
  Check,
  Maximize,
  Moon,
  Search,
  Sun,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Avatar from 'public/img/avatar.png';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function Topbar() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const { setTheme } = useTheme();
  const router = useRouter();

  const { data: session } = useSession();

  function toggleFullScreen() {
    const elem = document.documentElement as HTMLElement;
    if (elem.requestFullscreen) {
      elem
        .requestFullscreen()
        .then(() => {
          // console.log('Success');
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

  const handleLogout = () =>
    signOut({ redirect: false }).then(() => {
      localStorage.removeItem(process.env.NEXT_PUBLIC_PERMISSIONS_NAME);
      router.push('/auth/login');
    });

  const listNs = [
    {
      value: 'dashboard',
      label: 'Dashboard',
      link: '/',
    },
    {
      value: 'quotation',
      label: 'Quotation',
      link: '/quotation',
    },
    {
      value: 'quotation/create',
      label: 'Quotation/Create',
      link: '/quotation/create',
    },
    {
      value: 'jo',
      label: 'Job Order',
      link: '/jo',
    },
    {
      value: 'jo/create',
      label: 'Job Order/Create',
      link: '/jo/create',
    },
    {
      value: 'joc',
      label: 'JOC',
      link: '/joc',
    },
  ];

  return (
    <div className="flex items-center justify-between p-4 shadow-2xl">
      <div className="relative flex items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              role="combobox"
              aria-expanded={open}
              className="h-[40px] w-[250px] justify-between rounded-full border-2 border-gray-400 bg-transparent pl-4"
            >
              {value
                ? listNs.find((listN) => listN.value === value)?.label
                : 'search...'}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="mt-2 w-[200px] p-0">
            <Command className="!bg-white ">
              <CommandInput placeholder="Search........" />

              <CommandEmpty>No found.</CommandEmpty>
              <CommandGroup>
                {listNs.map((listN) => (
                  <CommandItem
                    key={listN.value}
                    value={listN.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    <a href={listN.link}> {listN.label}</a>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-4 text-graySecondary dark:text-white">
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
          </DropdownMenuContent>
        </DropdownMenu>

        <div
          className="fullscreen-button cursor-pointer dark:text-white"
          onClick={toggleFullScreen}
        >
          <Maximize />
        </div>

        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 dark:text-white">
              <Image
                src={Avatar}
                alt=""
                className="w-9 rounded-full"
                width={36}
                height={36}
              />

              {session?.user?.name}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-5 w-40 rounded-lg shadow-lg dark:text-black">
              <DropdownMenuLabel>Welcome</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button>
                  {' '}
                  <Link href="/profile/user">My Profile</Link>
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
