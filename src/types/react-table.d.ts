import { UseMutationResult } from '@tanstack/react-query';
import { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    deleteMutation?: UseMutationResult<any, unknown, string, unknown>;
    onOpenSheet?: (value: boolean) => void;
  }
}
