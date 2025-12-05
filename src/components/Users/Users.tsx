import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import columnsRows from './table/columnsRows';
import useGetTableData from './table/use-get-table-data';
import useTableProps from './table/use-table-props';
import SearchInput from './table/SearchInput';

const UsersTable = () => {
  const { tableData, pagination } = useGetTableData();

  const {
    sorting,
    onSortingChange,
    columnFilters,
    onColumnFiltersChange,
    pageSize,
    pageIndex,
    changePage,
    onPageSizeChange,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
  } = useTableProps();

  const table = useReactTable({
    data: tableData,
    columns: columnsRows,
    columnResizeMode: 'onChange', // helps with adjusting column size

    onSortingChange: onSortingChange,
    onColumnFiltersChange: onColumnFiltersChange,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const isTablePopulated = table.getRowModel().rows?.length !== 0;
  const areAllRowsFilled = isTablePopulated && table.getRowModel().rows?.length === pageSize;

  const firstElementIndex = pagination.offset + 1;
  const lastElementIndex = firstElementIndex + table.getRowModel().rows.length - 1;
  
  return (
    <>
      <div className="w-full">
        <div className="flex items-center py-4 px-2 gap-4">
          {/* <Input
            placeholder="Filter emails..."
            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
            className="max-w-sm"
          /> */}
          <SearchInput table={table} /> 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="overflow-hidden rounded-md border w-fit max-w-full">
          <Table
            className="table-fixed max-w-full "
            style={{
              width: table.getCenterTotalSize(), // this is needed for column resizing
            }}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className="group/head relative h-10 select-none last:[&>.cursor-col-resize]:opacity-0"
                        key={header.id}
                        {...{
                          colSpan: header.colSpan,
                          style: {
                            width: header.getSize(),
                          },
                        }}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanResize() && (
                          <div
                            {...{
                              onDoubleClick: () => header.column.resetSize(),
                              onMouseDown: header.getResizeHandler(),
                              onTouchStart: header.getResizeHandler(),
                              className:
                                'group-last/head:hidden absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:translate-x-px',
                            }}
                          />
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isTablePopulated &&
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="truncate">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              {!areAllRowsFilled &&
                Array.from({ length: pageSize - table.getRowModel().rows.length }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={columnsRows.length} className=" h-full text-center invisible">
                      No results
                    </TableCell>
                  </TableRow>
                ))}
              {!isTablePopulated && (
                <TableRow>
                  <TableCell colSpan={columnsRows.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected. */}
            Showing {firstElementIndex} to {lastElementIndex} of {pagination.totalElements} results
            {/* {pagination.size * (pagination.number - 1) + response.length} of {pagination.totalElements} results */}
          </div>
          <Select onValueChange={onPageSizeChange} value={String(pageSize)}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Select Rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Showing</SelectLabel>
                <SelectItem value="5"> 5</SelectItem>
                <SelectItem value="10"> 10</SelectItem>
                <SelectItem value="15"> 15</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => changePage('prev')} disabled={pageIndex === 1}>
              {'<'}
            </Button>
            {/* {[...Array(pagination.totalPages)].map((_, index) => (
              <Button
                key={index}
                variant={pagination.number === index + 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </Button>
            ))} */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage('next')}
              disabled={pageIndex === pagination.totalPages}
            >
              {'>'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersTable;
