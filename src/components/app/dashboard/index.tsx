'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import ApexCharts from 'apexcharts';
import { ApexOptions } from 'apexcharts';
import { Home, Menu } from 'lucide-react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export default function Content() {
  const options: ApexOptions = {
    chart: {
      height: 150,
      type: 'line',
      zoom: {
        enabled: true,
      },
    },
  };

  const optionsTwo: ApexOptions = {
    chart: {
      height: 350,
      type: 'bar',
      zoom: {
        enabled: true,
      },
    },
  };

  const series = [
    {
      name: 'JO',
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: 'QUOTATION',
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ];

  const seriesTwo = [
    {
      name: 'Tikus',
      data: [1, 10, 37, 42, 56, 88, 100],
    },
    {
      name: 'Kucing',
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ];

  return (
    <div className="grid">
      <div className="flex gap-3 items-center font-semibold mb-10 mt-5">
        <Home className="text-blueLight" />
        <h1>Dashboard</h1>
      </div>
      <div className="grid grid-cols-[1fr_2fr_1fr] gap-5 mb-5">
        <div className="w-full p-3 border-graySecondary/50 rounded-md border-2 gap-3 text-white font-bold dark:bg-secondDarkBlue flex">
          <div className="">
            <h1>AR</h1>
            <h3>Rp. 3000000</h3>
          </div>

          <Menu />
        </div>

        <div className="w-full px-5 py-1 border-graySecondary/50 rounded-md border-2 dark:bg-secondDarkBlue">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={150}
          />
        </div>

        <div className="w-full p-3 border-graySecondary/50 rounded-md border-2 gap-3 text-white font-bold dark:bg-secondDarkBlue flex">
          <div className="">
            <h1>HR</h1>
            <h3>Rp. 3000000</h3>
          </div>

          <Menu />
        </div>
      </div>

      <div className="mt-5 border-graySecondary/50 rounded-md border-2 w-[90%] dark:bg-secondDarkBlue">
        <ReactApexChart
          options={optionsTwo}
          series={seriesTwo}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
}
