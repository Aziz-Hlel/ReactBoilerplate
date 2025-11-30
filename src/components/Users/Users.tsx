import {
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    getCoreRowModel,
    flexRender,
    type Updater,
} from "@tanstack/react-table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { ArrowUp, ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import type { User } from "@/types/user/user";
import userService from "@/Api/service/userService";

const columnsRows: ColumnDef<User>[] = [
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    {column.getIsSorted() === "asc" && <ArrowUp />}
                    {column.getIsSorted() === "desc" && <ArrowUp className="rotate-180" />}
                    {column.getIsSorted() === false && <ArrowUpDown />}
                </Button>
            );
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,

        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "firstName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    First Name
                    {column.getIsSorted() === "asc" && <ArrowUp />}
                    {column.getIsSorted() === "desc" && <ArrowUp className="rotate-180" />}
                    {column.getIsSorted() === false && <ArrowUpDown />}
                </Button>
            );
        },
        cell: ({ row }) => <div className="uppercase">{row.getValue("firstName")}</div>,

        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "lastName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Name
                    {column.getIsSorted() === "asc" && <ArrowUp />}
                    {column.getIsSorted() === "desc" && <ArrowUp className="rotate-180" />}
                    {column.getIsSorted() === false && <ArrowUpDown />}
                </Button>
            );
        },
        cell: ({ row }) => <div className="uppercase">{row.getValue("lastName")}</div>,

        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "gender",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Gender
                    {column.getIsSorted() === "asc" && <ArrowUp />}
                    {column.getIsSorted() === "desc" && <ArrowUp className="rotate-180" />}
                    {column.getIsSorted() === false && <ArrowUpDown />}
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="uppercase  text-start px-4">
                {row.getValue("gender") === "M" ? "Male" : "Female"}
            </div>
        ),
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        cell: ({ row }) => (
            <div className="uppercase text-center">{row.getValue("phoneNumber") ?? "-"}</div>
        ),
        enableSorting: false,
        enableHiding: true,
    },
];

const UsersTable = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const { data: response } = useQuery({
        queryKey: ["users", searchParams.toString()],
        queryFn: async () => await userService.getUsers(searchParams),
    });



    const tableData = response?.success ? response?.data.data : [];
    const pagination = response?.success ? response?.data.pagination : { limit: 0, page: 0, total: 0, totalPages: 0 };

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const onSortingChange = (updater: Updater<SortingState>) => {
        const newSortingState = typeof updater === "function" ? updater(sorting) : updater;

        const sortField = newSortingState[0]?.id ?? "createdAt";
        const sortOrder = newSortingState[0]?.desc ? "desc" : "asc";

        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set("sort", sortField);
            params.set("order", sortOrder);
            return params;
        });
    };

    const sorting = useMemo(() => {
        if (searchParams.get("sort") && searchParams.get("order")) {
            return [
                {
                    id: searchParams.get("sort") as string,
                    desc: searchParams.get("order") === "desc",
                },
            ];
        }
        return [];
    }, [searchParams]);

    const columnFilters = useMemo(() => {
        const searchValue = searchParams.get("search");
        if (searchValue !== "") {
            return [
                {
                    id: "email",
                    value: searchValue,
                },
            ];
        }
        return [];
    }, [searchParams]);

    const onColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
        const newColumnFiltersState = typeof updater === "function" ? updater(columnFilters) : updater;
        const searchValue = (newColumnFiltersState[0]?.value as string) ?? "";

        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            searchValue !== "" ? params.set("search", searchValue) : params.delete("search");
            return params;
        });
    };

    const pageSize = useMemo(() => {
        const page = Number(searchParams.get("limit"));
        if (page < 1) {
            searchParams.set("limit", "5");
        }
        return page;
    }, [searchParams]);

    const pageIndex = useMemo(() => {
        const page = Number(searchParams.get("page"));
        if (page < 1) {
            searchParams.set("page", "1");
        }
        return page;
    }, [searchParams]);

    const changePage = (direc: "next" | "prev" | number) => {
        if (pageIndex === 1 && direc === "prev") return;
        if (pageIndex === pagination.totalPages && direc === "next") return;

        let newPage: number = pagination.page;
        if (direc === "next") newPage = pagination.page + 1;
        if (direc === "prev") newPage = pagination.page - 1;
        if (typeof direc === "number") newPage = direc;

        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set("page", String(newPage));
            return params;
        });
    };

    const onPageSizeChange = (limit: string) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set("limit", String(limit));
            params.set("page", "1");
            return params;
        });
    };

    const table = useReactTable({
        data: tableData,
        columns: columnsRows,
        onSortingChange: onSortingChange,
        onColumnFiltersChange: onColumnFiltersChange,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        // getSortedRowModel: getSortedRowModel(),
        // getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        // onRowSelectionChange: setRowSelection,
        state: {
            sorting: sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <>
            <div className="w-full">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter emails..."
                        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />
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
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length > 0 &&
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            {table.getRowModel().rows?.length !== 0 &&
                                pageSize - table.getRowModel().rows?.length > 0 &&
                                Array.from({ length: pageSize - table.getRowModel().rows.length }).map(
                                    (_, index) => (
                                        <TableRow key={index}>
                                            <TableCell
                                                colSpan={columnsRows.length}
                                                className=" h-full text-center invisible"
                                            >
                                                No results
                                            </TableCell>
                                        </TableRow>
                                    ),
                                )}
                            {table.getRowModel().rows?.length === 0 && (
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
                        Showing {pagination.limit * (pagination.page - 1) + 1}-
                        {pagination.limit * (pagination.page - 1) + tableData.length} of {pagination.total}{" "}
                        results
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
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => changePage("prev")}
                            disabled={pageIndex === 1}
                        >
                            {"<"}
                        </Button>
                        {[...Array(pagination.totalPages)].map((_, index) => (
                            <Button
                                key={index}
                                variant={pagination.page === index + 1 ? "default" : "outline"}
                                size="sm"
                                onClick={() => changePage(index + 1)}
                            >
                                {index + 1}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => changePage("next")}
                            disabled={pageIndex === pagination.totalPages}
                        >
                            {">"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UsersTable;
