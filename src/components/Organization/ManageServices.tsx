import { useState } from "react";
// import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { ServiceRequestManagement } from "./ServiceRequestManagement";
// import { ServiceRequestManagement } from "./ServiceRequestManagement"

type Service = {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  pendingCount: number;
  completedCount: number;
  ongoingCount: number;
  revenue: number;
  allocatedEmployees: number;
  manager: string;
};

const data: Service[] = [
  {
    id: 1,
    name: "Car Wash",
    category: "Automotive",
    subcategory: "Cleaning",
    pendingCount: 5,
    completedCount: 50,
    ongoingCount: 3,
    revenue: 2500,
    allocatedEmployees: 4,
    manager: "John Doe",
  },
  {
    id: 2,
    name: "House Cleaning",
    category: "Home",
    subcategory: "Cleaning",
    pendingCount: 8,
    completedCount: 75,
    ongoingCount: 5,
    revenue: 3750,
    allocatedEmployees: 6,
    manager: "Jane Smith",
  },

  {
    id: 3,
    name: "Lawn Mowing",
    category: "Gardening",
    subcategory: "Maintenance",
    pendingCount: 3,
    completedCount: 40,
    ongoingCount: 2,
    revenue: 2000,
    allocatedEmployees: 3,
    manager: "Mike Johnson",
  },
  {
    id: 4,
    name: "House Cleaning",
    category: "Home",
    subcategory: "Cleaning",
    pendingCount: 9,
    completedCount: 70,
    ongoingCount: 6,
    revenue: 3750,
    allocatedEmployees: 6,
    manager: "Jane Smith",
  },
  {
    id: 5,
    name: "Car Wash",
    category: "Automotive",
    subcategory: "Cleaning",
    pendingCount: 3,
    completedCount: 50,
    ongoingCount: 4,
    revenue: 2500,
    allocatedEmployees: 4,
    manager: "John Doe",
  },
];

export function ManageService() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: "name",
      header: "Service Name",
      cell: ({ row }) => (
        <Link
          to={`/service/${row.original.id}`}
          className="font-medium text-blue-600 hover:underline">
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "subcategory",
      header: "Subcategory",
    },
    {
      accessorKey: "pendingCount",
      header: "Pending",
    },
    {
      accessorKey: "completedCount",
      header: "Completed",
    },
    {
      accessorKey: "ongoingCount",
      header: "Ongoing",
    },
    {
      accessorKey: "revenue",
      header: "Gained Revenue",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("revenue"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    // {
    //   accessorKey: "allocatedEmployees",
    //   header: "Allocated Employees",
    // },
    // {
    //   accessorKey: "manager",
    //   header: "Manager",
    // },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          onClick={() => handleManageClick(row.original)}>
          Manage
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleManageClick = (service: Service) => {
    setSelectedService(service);
  };

  return (
    <div className="space-y-4">
      <Card className="">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-white">
            Manage Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search services..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <Select
              onValueChange={(value) =>
                table.getColumn("category")?.setFilterValue(value)
              }>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Automotive">Automotive</SelectItem>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="Gardening">Gardening</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                table.getColumn("subcategory")?.setFilterValue(value)
              }>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subcategories</SelectItem>
                <SelectItem value="Cleaning">Cleaning</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }>
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
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
                                header.getContext()
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
                      data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}>
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {selectedService && (
        // <div className="">hhh</div>
        <ServiceRequestManagement
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
        // <ServiceRequestManagement service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </div>
  );
}
