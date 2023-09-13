import {
  Table as ShadTable,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type TableProps = {
  columns: {
    id: string;
    header: string;
  }[];
  rows: any[];
  tableCaption?: string;
};

const Table: React.FC<TableProps> = ({ columns, rows = [], tableCaption }) => {
  return (
    <ShadTable>
      {tableCaption && <TableCaption>{tableCaption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {columns.map((column, idx) => (
            <TableHead key={idx}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows?.map((row, idx: number) => (
          <TableRow key={idx}>
            {columns.map((column, index: number) => (
              <TableCell key={index} className="font-medium">
                {row[column.id]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </ShadTable>
  );
};

export default Table;
