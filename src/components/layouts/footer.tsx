import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <div className="absolute bottom-0 bg-blueNav text-white flex mx-auto text-left justify-center w-[80%] right-0">
      <h1>
        Copyright © 2021
        <span>
          <Link href="/">
            {''}MY FORWARDING{''}
          </Link>
        </span>{' '}
        All rights reserved.
      </h1>
    </div>
  );
}
