import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className="absolute bottom-0 right-0 !z-0 mx-auto flex w-full justify-center bg-blueNav text-left text-white">
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
