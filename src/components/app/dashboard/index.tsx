import React from 'react';
import { Home } from 'lucide-react';

export default function Content() {
  return (
    <div className="grid">
      <div className="flex gap-3 items-center font-semibold mb-20">
        <Home className="text-blueLight" />
        <h1>Dashboard</h1>
      </div>
      <div className="flex gap-3 mb-5">
        <div className="w-full px-5 py-1 border-graySecondary/50 rounded-md border-2">
          <h1>Ar</h1>
        </div>

        <div className="w-full px-5 py-1 border-graySecondary/50 rounded-md border-2">
          <h1>Ar</h1>
        </div>

        <div className="w-full px-5 py-1 border-graySecondary/50 rounded-md border-2">
          <h1>Ar</h1>
        </div>
      </div>
    </div>
  );
}
