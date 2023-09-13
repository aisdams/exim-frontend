import React, { useState } from 'react';
import { Command, Search, PlusSquare, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { DateRangePicker } from '@/components/forms/data-range-picker';

export default function List() {
  const [date, setDate] = React.useState<Date>();
  const [orderBy, setOrderBy] = useState('All');
  const [orderByTwo, setOrderByTwo] = useState('Quo No');
  const [orderByThree, setOrderByThree] = useState('Quo No');

  return (
    <div className="mt-10 text-sm">
      <div className="flex gap-3">
        <Command />
        <h1> Quotation</h1>
      </div>
      <div className="w-full rounded-xl border-2 border-graySecondary/50 mt-5 px-3 py-3">
        <div className="flex gap-3 items-center mb-5">
          <Search className="w-4 h-4" />
          <h3> Filter Data</h3>
        </div>

        <div className="">
          <div className="flex items-center gap-3">
            <h3>Date & To: </h3>

            <DateRangePicker
              onUpdate={(values) => console.log(values)}
              initialDateFrom="2023-01-01"
              initialDateTo="2023-12-31"
              align="start"
              locale="en-GB"
              showCompare={false}
            />
          </div>

          <div className="flex items-center gap-3 mt-3">
            <h1>Status : </h1>
            <Select value={orderBy} onValueChange={setOrderBy}>
              <SelectTrigger className="h-7 w-max [&>span]:text-xs bg-lightWhite">
                <SelectValue placeholder="Order by" className="" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  <SelectLabel>Order By</SelectLabel>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">OUT_OF_STOCK</SelectItem>
                  <SelectItem value="TOP_SELLING">TOP_SELLING</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <h3>Filter By : </h3>

            <div className="grid">
              <div className="flex gap-1">
                <Select value={orderByTwo} onValueChange={setOrderByTwo}>
                  <SelectTrigger className="h-7 w-max [&>span]:text-xs bg-lightWhite">
                    <SelectValue placeholder="Order by" className="" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectGroup>
                      <SelectLabel>Order By</SelectLabel>
                      <SelectItem value="Quo No">Quo No</SelectItem>
                      <SelectItem value="OUT_OF_STOCK">OUT_OF_STOCK</SelectItem>
                      <SelectItem value="TOP_SELLING">TOP_SELLING</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <input
                  type="text"
                  name=""
                  id=""
                  placeholder=""
                  className="border border-graySecondary rounded-md"
                />
              </div>

              <div className="flex gap-1 mt-2">
                <Select value={orderByThree} onValueChange={setOrderByThree}>
                  <SelectTrigger className="h-7 w-max [&>span]:text-xs bg-lightWhite">
                    <SelectValue placeholder="Order by" className="" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectGroup>
                      <SelectLabel>Order By</SelectLabel>
                      <SelectItem value="Quo No">Quo No</SelectItem>
                      <SelectItem value="OUT_OF_STOCK">OUT_OF_STOCK</SelectItem>
                      <SelectItem value="TOP_SELLING">TOP_SELLING</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <input
                  type="text"
                  name=""
                  id=""
                  placeholder=""
                  className="border border-graySecondary rounded-md"
                />

                <Button
                  className={cn(
                    'justify-start text-left font-normal bg-blue-500 rounded-md h-7'
                  )}
                >
                  <Search className="w- 4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-graySecondary/50 mt-2 px-3 pt-3 h-max w-full">
        <Link href="/quotation/create">
          <Button className="mb-5 bg-green-600 text-white w-max px-2 py-4 h-5 gap-2">
            <PlusSquare className="h-5" />
            <h3>Create Quotation</h3>
          </Button>
        </Link>
      </div>

      <div className="">
        <table className="min-w-full border-collapse border border-gray-300 text-[#555555] text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left bg-lightWhite">NO</th>
              <th className="p-3 text-left bg-lightWhite">QUO NO QUO DATE</th>
              <th className="p-3 text-left bg-lightWhite">TYPE</th>
              <th className="p-3 text-left bg-lightWhite">CUSTOMER</th>
              <th className="p-3 text-left bg-lightWhite">LOADING DISCHARGE</th>
              <th className="p-3 text-left bg-lightWhite">SUBJECT</th>
              <th className="p-3 text-left bg-lightWhite">SALES</th>
              <th className="p-3 text-left bg-lightWhite">Status</th>
              <th className="p-3 text-left bg-lightWhite">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3">QUO-2300039 12-09-2023</td>
              <td className="p-3">Import FCL</td>
              <td className="p-3">OCEAN LINK FREIGHT SERVICES SDN BHD</td>
              <td className="p-3">ANHUI, CHINA ASUNCION, PARAGUAY </td>
              <td className="p-3">TEST</td>
              <td className="p-3">TEST</td>
              <td className="p-3">TEST</td>
              <td className="p-3">TEST</td>
              <td className="p-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2">
                    <h1>Detail Admin</h1>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="shadow-lg rounded-lg">
                    <DropdownMenuLabel className="text-xs flex">
                      COPY QUO <Copy />{' '}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
