import type { User } from '@/types/user/user';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUp, ArrowUpDown } from 'lucide-react';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
dayjs.extend(localizedFormat);

type TableColumnDefinition<T> = ColumnDef<T, unknown> & { accessorKey: keyof T };

const TableHeaderComp: React.FC<React.ComponentProps<'button'>> = ({ children }) => {
  return (
    <div className="truncate cursor-pointer flex items-center justify-start gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all [&_svg:not([class*='size-'])]:size-4  ">
      {children}
    </div>
  );
};

const columnsRows: TableColumnDefinition<User>[] = [
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <TableHeaderComp onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ArrowUpDown />}
        </TableHeaderComp>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,

    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => {
      return (
        <TableHeaderComp onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Username
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ArrowUpDown />}
        </TableHeaderComp>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue('username')}</div>,

    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <TableHeaderComp onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Role
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ArrowUpDown />}
        </TableHeaderComp>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue('role')}</div>,

    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <TableHeaderComp onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Created At
          {column.getIsSorted() === 'asc' && <ArrowUp />}
          {column.getIsSorted() === 'desc' && <ArrowUp className="rotate-180" />}
          {column.getIsSorted() === false && <ArrowUpDown />}
        </TableHeaderComp>
      );
    },
    cell: ({ row }) => {
      const dateString = row.getValue('createdAt') as string;
      const formattedDate = dayjs(dateString).format('LL');
      return <div className="  w-full">{formattedDate}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
];

export default columnsRows;
