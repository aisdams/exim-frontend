import React, { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { LayoutDashboard, ClipboardEdit, Boxes } from 'lucide-react';
import Logo from 'public/img/logo.png';

import Link from 'next/link';
import sidebarData from '@/data/sidebar-data';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Sidebar() {
  const [isActive, setIsActive] = useState('');
  return (
    <div className="w-[20rem] h-screen bg-blueNav rounded-r-[2rem] text-white">
      <div className="flex relative">
        <div className="bg-blueLight h-screen px-5 rounded-e-[2rem] rounded-s-[2rem] w-[18%]">
          <div className="grid absolute top-[5.5rem] gap-5 left-3">
            <LayoutDashboard className="text-lg text-white" />
            <ClipboardEdit className="text-lg text-white" />
            <Boxes className="text-lg text-white" />
          </div>
        </div>

        <div>
          <Image src={Logo} alt="" />
          <div className="mt-1">
            {sidebarData.map((sidebar, idx) => (
              <NavigationMenu key={idx}>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href={sidebar.link}>
                      <NavigationMenuTrigger className="text-lg">
                        {sidebar.title}
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

{
  /* <NavigationMenuContent>
<NavigationMenuLink>Link</NavigationMenuLink>
<Link href="/docs" legacyBehavior passHref>
  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
    Documentation
  </NavigationMenuLink>
</Link>
</NavigationMenuContent> */
}
