import { UseMutationResult } from '@tanstack/react-query';
import { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    deleteMutation?: UseMutationResult<any, unknown, string, unknown>;
    onOpenSheet?: (value: boolean) => void;
  }
}
