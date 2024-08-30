import React from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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


export default function OrganizationsTable() {
  const [tableData, setTableData] = React.useState(data);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
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
      header: "Created On",
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
    data: tableData.filter((item) =>
      item.name.toLowerCase().includes(globalFilter.toLowerCase()),
    ),
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
      globalFilter,
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
      {/* Search Input */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter organizations..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      {/* Table */}
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
      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will change the status of the organization. Do you
              want to proceed?
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
