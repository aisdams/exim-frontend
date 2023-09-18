import { Input } from '@/components/ui/input';
import React from 'react';
import { Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function Create() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 mt-5 gap-3">
        <div className="border-2 border-graySecondary/50 px-3 py-3 rounded-md">
          <div className="flex gap-5">
            <h3>
              Data <span>:</span>
            </h3>
            <Input name="data" type="email" className="w-1/2" />
          </div>
          <div className="flex gap-5">
            <h3>
              Subject <span>:</span>
            </h3>
            <Input name="data" type="email" className="w-1/2" />
          </div>
          <div className="flex gap-5">
            <h3>
              Shipper <span>:</span>
            </h3>
            <Input name="data" type="email" className="w-1/2" />
          </div>
        </div>

        <div className="border-2 border-graySecondary/50 px-3 py-3 rounded-md">
          <div className="flex gap-5">
            <h3>Data :</h3>
            <Input name="data" type="email" className="w-1/2" />
          </div>
          <div className="flex gap-5">
            <h3>Subject :</h3>
            <Input name="data" type="email" className="w-1/2" />
          </div>
          <div className="flex gap-5">
            <h3>Shipper :</h3>
            <Input name="data" type="email" className="w-1/2" />
          </div>
        </div>
      </div>

      <table className="border-collapse border border-graySecondary/50 text-[#555555] text-sm mt-5">
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
  );
}
