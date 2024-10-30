import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import DashboardAPI, { dashboardAPI } from "@/api/dashboard";
import { OrganizationSettingsServiceDTO } from "@/types/dashboardTypes";
import { useParams } from "react-router-dom";

// interface Service {
//   id: number;
//   name: string;
//   location: string;
//   isAvailable: boolean;
//   category: string;
//   subcategory: string;
// }

// const services: Service[] = [
//   {
//     id: 1,
//     name: "Car Wash",
//     location: "New York",
//     isAvailable: true,
//     category: "Automotive",
//     subcategory: "Cleaning",
//   },
//   {
//     id: 2,
//     name: "Lawn Mowing",
//     location: "New York",
//     isAvailable: false,
//     category: "Home",
//     subcategory: "Landscaping",
//   },
//   {
//     id: 3,
//     name: "Gardening",
//     location: "New York",
//     isAvailable: true,
//     category: "Home",
//     subcategory: "Landscaping",
//   },
//   {
//     id: 4,
//     name: "House Cleaning",
//     location: "New York",
//     isAvailable: false,
//     category: "Home",
//     subcategory: "Cleaning",
//   },
//   {
//     id: 5,
//     name: "Window Washing",
//     location: "New York",
//     isAvailable: true,
//     category: "Home",
//     subcategory: "Cleaning",
//   },
//   {
//     id: 6,
//     name: "Pest Control",
//     location: "New York",
//     isAvailable: false,
//     category: "Home",
//     subcategory: "Maintenance",
//   },
// ];

// const api = new DashboardAPI();

export default function Component() {
  const [data, setData] = useState<OrganizationSettingsServiceDTO[]>([]); //services
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const { orgId } = useParams<{ orgId: string }>();
  // const toggleServiceAvailability = (id: number) => {
  //   setData(
  //     data.map((service) =>
  //       service.id === id
  //         ? { ...service, isAvailable: !service.isAvailable }
  //         : service
  //     )
  //   );
  // };

  // Load services on mount
  useEffect(() => {
    loadServices();
  }, []);

  // Function to load all organization services
  const loadServices = async () => {
    setLoading(true);
    try {
      const services = await dashboardAPI.fetchServicesByOrganization(
        orgId as string
      );
      console.log(services);
      setData(services);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle service availability and update state
  const toggleServiceAvailability = async (
    organizationId: number,
    serviceId: number
  ) => {
    try {
      const updatedService = await dashboardAPI.toggleServiceAvailability(
        organizationId,
        serviceId
      );
      // setData((prevData) =>
      //   prevData.map((service) =>
      //     service.id === serviceId
      //       ? { ...service, isAvailable: !service.isAvailable }
      //       : service
      //   )
      // );
      await loadServices();
    } catch (error) {
      console.error("Failed to toggle service availability:", error);
    }
  };

  const columns: ColumnDef<OrganizationSettingsServiceDTO>[] = [
    {
      accessorKey: "name",
      header: "Service Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <Button variant="outline" disabled className="text-xs">
          <MapPin className="mr-2 h-4 w-4" />
          {row.getValue("location")}
        </Button>
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
      accessorKey: "isAvailable",
      header: "Availability",
      cell: ({ row }) => {
        const service = row.original;
        console.log(service);
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={service.isAvailable}
              onCheckedChange={() =>
                toggleServiceAvailability(Number(orgId), service.id)
              }
            />

            <Badge variant={service.isAvailable ? "default" : "secondary"}>
              {service.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return value === "Available" ? row.getValue(id) : !row.getValue(id);
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="container mx-auto p-6 bg-background rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Service Settings</h1>
      <div className="flex flex-col space-y-4 md:flex-row-reverse md:items-center md:justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={
              (table.getColumn("isAvailable")?.getFilterValue() as string) ??
              "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("isAvailable")
                ?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={
              (table.getColumn("category")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("category")
                ?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Automotive">Automotive</SelectItem>
              <SelectItem value="Home">Home</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={
              (table.getColumn("subcategory")?.getFilterValue() as string) ??
              "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("subcategory")
                ?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by subcategory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              <SelectItem value="Cleaning">Cleaning</SelectItem>
              <SelectItem value="Landscaping">Landscaping</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
                  className="h-24 text-center"
                >
                  No services available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
