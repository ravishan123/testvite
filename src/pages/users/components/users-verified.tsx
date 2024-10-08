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
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  isActive: boolean;
};

// Sample data
const data: DataItem[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    joinedDate: "2023-01-15",
    isActive: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "234-567-8901",
    joinedDate: "2023-02-20",
    isActive: false,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "345-678-9012",
    joinedDate: "2023-03-25",
    isActive: true,
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    phone: "456-789-0123",
    joinedDate: "2023-04-10",
    isActive: true,
  },
  {
    id: "5",
    name: "Charlie Davis",
    email: "charlie@example.com",
    phone: "567-890-1234",
    joinedDate: "2023-05-05",
    isActive: false,
  },
  {
    id: "6",
    name: "Daisy Evans",
    email: "daisy@example.com",
    phone: "678-901-2345",
    joinedDate: "2023-06-15",
    isActive: true,
  },
  {
    id: "7",
    name: "Frank Harris",
    email: "frank@example.com",
    phone: "789-012-3456",
    joinedDate: "2023-07-20",
    isActive: true,
  },
  {
    id: "8",
    name: "Grace Lewis",
    email: "grace@example.com",
    phone: "890-123-4567",
    joinedDate: "2023-08-30",
    isActive: false,
  },
  {
    id: "9",
    name: "Henry Miller",
    email: "henry@example.com",
    phone: "901-234-5678",
    joinedDate: "2023-09-12",
    isActive: true,
  },
  {
    id: "10",
    name: "Ivy Moore",
    email: "ivy@example.com",
    phone: "012-345-6789",
    joinedDate: "2023-10-01",
    isActive: true,
  },
  {
    id: "11",
    name: "Jack Nelson",
    email: "jack@example.com",
    phone: "123-456-7891",
    joinedDate: "2023-11-15",
    isActive: false,
  },
  {
    id: "12",
    name: "Kathy Olson",
    email: "kathy@example.com",
    phone: "234-567-8902",
    joinedDate: "2023-12-05",
    isActive: true,
  },
  {
    id: "13",
    name: "Liam Parker",
    email: "liam@example.com",
    phone: "345-678-9013",
    joinedDate: "2024-01-10",
    isActive: true,
  },
  {
    id: "14",
    name: "Mia Quinn",
    email: "mia@example.com",
    phone: "456-789-0124",
    joinedDate: "2024-02-18",
    isActive: false,
  },
  {
    id: "15",
    name: "Nina Roberts",
    email: "nina@example.com",
    phone: "567-890-1235",
    joinedDate: "2024-03-25",
    isActive: true,
  },
];

export default function DashboardTable() {
  const [tableData, setTableData] = React.useState(data);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);
  const [itemToToggle, setItemToToggle] = React.useState<DataItem | null>(null);

  const columns: ColumnDef<DataItem>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "joinedDate",
      header: "Joined Date",
    },
    {
      id: "actions",
      header: "Status",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Switch
            checked={item.isActive}
            onCheckedChange={() => {
              setItemToToggle(item);
              setConfirmationOpen(true);
            }}
          />
        );
      },
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

  const handleConfirmToggle = () => {
    if (itemToToggle) {
      const updatedData = tableData.map((dataItem) =>
        dataItem.id === itemToToggle.id
          ? { ...dataItem, isActive: !dataItem.isActive }
          : dataItem,
      );
      setTableData(updatedData);
    }
    setConfirmationOpen(false);
    setItemToToggle(null);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
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
      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will change the status of the user. Do you want to
              proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmToggle}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
