import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/custom/button";
import { Input } from "@/components/ui/input";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";

// Define the type for your data
type DataItem = {
  id: string;
  email: string;
  joinedDate: string;
};

// Sample data
const data: DataItem[] = [
  {
    id: "1",
    email: "john@example.com",
    joinedDate: "2023-01-15",
  },
  {
    id: "2",
    email: "jane@example.com",
    joinedDate: "2023-02-20",
  },
  {
    id: "3",
    email: "bob@example.com",
    joinedDate: "2023-03-25",
  },
  {
    id: "4",
    email: "alice@example.com",
    joinedDate: "2023-04-10",
  },
  {
    id: "5",
    email: "charlie@example.com",
    joinedDate: "2023-05-05",
  },
  {
    id: "6",
    email: "david@example.com",
    joinedDate: "2023-06-15",
  },
  {
    id: "7",
    email: "eve@example.com",
    joinedDate: "2023-07-20",
  },
  {
    id: "8",
    email: "frank@example.com",
    joinedDate: "2023-08-30",
  },
  {
    id: "9",
    email: "grace@example.com",
    joinedDate: "2023-09-12",
  },
  {
    id: "10",
    email: "hank@example.com",
    joinedDate: "2023-10-01",
  },
  {
    id: "11",
    email: "irene@example.com",
    joinedDate: "2023-11-15",
  },
  {
    id: "12",
    email: "jack@example.com",
    joinedDate: "2023-12-05",
  },
  {
    id: "13",
    email: "karen@example.com",
    joinedDate: "2024-01-10",
  },
  {
    id: "14",
    email: "leo@example.com",
    joinedDate: "2024-02-18",
  },
  {
    id: "15",
    email: "mia@example.com",
    joinedDate: "2024-03-25",
  },
];

export default function UnverifiedTable() {
  const [tableData, setTableData] = React.useState(data);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const columns: ColumnDef<DataItem>[] = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "joinedDate",
      header: "Joined Date",
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          {Array.from({ length: table.getPageCount() }, (_, i) => (
            <Button
              key={i}
              variant={
                table.getState().pagination.pageIndex === i
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => table.setPageIndex(i)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
