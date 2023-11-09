'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Cost } from '@/types';
import { useQuery } from '@tanstack/react-query';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { Home, Menu, Plane, Truck } from 'lucide-react';
import { toast } from 'react-toastify';

import * as CostService from '@/apis/cost.api';
import { getErrMessage } from '@/lib/utils';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export default function Content() {
  const router = useRouter();
  const [costData, setCostData] = useState<Cost[]>([]);
  const [totalPrice, setTotalPrice] = useState<string>('0');

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

  useEffect(() => {
    const dataCost = () => {
      fetch('http://localhost:8089/api/cost')
        .then((response) => response.json())
        .then((data) => {
          setCostData(data.data);

          const total = data.data.reduce(
            (accumulator: any, cost: any) =>
              accumulator + parseFloat(cost.price),
            0
          );

          setTotalPrice(total);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };

    dataCost();
  }, []);

  const dataCost = () => {
    fetch('http://localhost:8089/api/cost')
      .then((response) => response.json())
      .then((data) => {
        setCostData(data.data);
        const total = data.data.reduce(
          (accumulator: any, cost: any) => accumulator + cost.price,
          0
        );
        setTotalPrice(total.toString().replace(/^0+/, ''));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="grid">
      <div className="z-[99] mb-10 mt-5 flex items-center gap-3 font-semibold">
        <Home className="text-blueLight" />
        <h1>Dashboard</h1>
      </div>
      <div className="mb-5 grid grid-cols-[1fr_2fr_1fr] gap-5">
        <div className="w-full gap-3 rounded-md border-2 border-graySecondary/50 p-3 pt-10 text-center font-bold text-darkBlue dark:bg-secondDarkBlue dark:text-white">
          <Truck className="mx-auto grid " size={34} />
          <p>Rp. {totalPrice}</p>
          <h2>Total Price.</h2>
        </div>

        <div className="w-full rounded-md border-2 border-graySecondary/50 px-5 py-1 dark:bg-secondDarkBlue">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={150}
          />
        </div>

        <div className="w-full gap-3 rounded-md border-2 border-graySecondary/50 p-3 pt-10 text-center font-bold text-darkBlue dark:bg-secondDarkBlue dark:text-white">
          <Plane className="mx-auto grid " size={34} />
          <h2 className="font-light">310 Total Export/Import</h2>
          <h2>Lorem ipsum dolor sit amet..</h2>
        </div>
      </div>

      <div className="mt-5 w-[90%] rounded-md border-2 border-graySecondary/50 dark:bg-secondDarkBlue">
        <ReactApexChart
          options={optionsTwo}
          series={seriesTwo}
          type="bar"
          height={350}
        />
      </div>

      {/* list jo dan joc */}
    </div>
  );
}
