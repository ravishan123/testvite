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
  owners: string;
  createdOn: string;
  isActive: boolean;
};

// Sample data
const data: DataItem[] = [
  {
    id: "1",
    name: "SmashTeaps",
    owners: "John Doe, Tom Jones",
    createdOn: "25/11/2022",
    isActive: true,
  },
  {
    id: "2",
    name: "ACME",
    owners: "Gus Fring",
    createdOn: "20/12/2022",
    isActive: false,
  },
  {
    id: "3",
    name: "TechnoWiz",
    owners: "Alice Johnson",
    createdOn: "15/01/2023",
    isActive: true,
  },
  {
    id: "4",
    name: "InnovateX",
    owners: "Bob Brown",
    createdOn: "30/01/2023",
    isActive: true,
  },
  {
    id: "5",
    name: "GreenCo",
    owners: "Emma White",
    createdOn: "10/02/2023",
    isActive: false,
  },
  {
    id: "6",
    name: "FutureTech",
    owners: "Michael Green",
    createdOn: "05/03/2023",
    isActive: true,
  },
  {
    id: "7",
    name: "NextGen",
    owners: "Sophie Black",
    createdOn: "22/03/2023",
    isActive: true,
  },
  {
    id: "8",
    name: "EcoLife",
    owners: "James Carter",
    createdOn: "17/04/2023",
    isActive: false,
  },
  {
    id: "9",
    name: "BioGen",
    owners: "Olivia Brown",
    createdOn: "01/05/2023",
    isActive: true,
  },
  {
    id: "10",
    name: "Quantum Solutions",
    owners: "David Harris",
    createdOn: "19/05/2023",
    isActive: true,
  },
  {
    id: "11",
    name: "Horizon Labs",
    owners: "Natalie Green",
    createdOn: "02/06/2023",
    isActive: false,
  },
  {
    id: "12",
    name: "Pioneer Corp",
    owners: "William Young",
    createdOn: "14/07/2023",
    isActive: true,
  },
  {
    id: "13",
    name: "Velocity",
    owners: "Sophia Wilson",
    createdOn: "29/08/2023",
    isActive: true,
  },
  {
    id: "14",
    name: "SustainX",
    owners: "Lucas Moore",
    createdOn: "16/09/2023",
    isActive: false,
  },
  {
    id: "15",
    name: "TechSphere",
    owners: "Isabella Davis",
    createdOn: "25/10/2023",
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
      accessorKey: "owners",
      header: "Owners",
    },
    {
      accessorKey: "createdOn",
      header: "Created on",
    },
    {
      accessorKey: "createdOn",
      header: "Created on ",
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
