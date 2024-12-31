import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { ChevronDown, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import ServiceRequestManagement from "./ServiceRequestManagement";
import { Link} from "react-router-dom";
import { dashboardAPI } from "@/api/dashboard";
// import { fetchOrganizationServices } from "@/types/dashboardTypes";
import { useAuth } from "@/context/AuthContext";

type Service = {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  pendingCount: number;
  completedCount: number;
  ongoingCount: number;
  revenue: number;
  isEnabled: boolean;
};

export function ManageService() {
  const [services, setServices] = useState<Service[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    subcategory: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (user?.user_type !== "USER" || !user.organization) return;
        const response = await dashboardAPI.fetchOrganizationServices(
          user.organization.id.toString()
        );
        const transformedData = response.map(
          (service): Service => ({
            id: service.id,
            name: service.name,
            category: service.category,
            subcategory: service.subcategory ?? "",
            pendingCount: service.pendingCount ?? 0,
            completedCount: service.completedCount ?? 0,
            ongoingCount: service.ongoingCount ?? 0,
            revenue: service.revenue ?? 0,
            isEnabled: true, // Assuming all fetched services are enabled by default
          })
        );
        setServices(transformedData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [user]);

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: "name",
      header: "Service Name",
      cell: ({ row }) => (
        <Link
          to={`/service/${row.original.id}`}
          className="font-medium text-blue-600 hover:underline"
        >
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
    {
      id: "isEnabled",
      header: "Enabled",
      cell: ({ row }) => (
        <Switch
          checked={row.original.isEnabled}
          onCheckedChange={(checked) => handleServiceToggle(row.original.id, checked)}
        />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          onClick={() => handleManageClick(row.original)}
        >
          Manage
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: services,
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

  const handleServiceToggle = async (serviceId: number, isEnabled: boolean) => {
    try {
      // Call API to update service status
      // await dashboardAPI.updateServiceStatus(serviceId, isEnabled);
      
      // Update local state
      setServices(services.map(service => 
        service.id === serviceId ? { ...service, isEnabled } : service
      ));
    } catch (error) {
      console.error("Error updating service status:", error);
      // Revert the switch if the API call fails
    }
  };

  const handleAddService = async () => {
    try {
      if (user?.user_type !== "USER" || !user.organization) return;
      // Call API to add the new service
      // const addedService = await dashboardAPI.addService(user.organization.id.toString(), newService);
      
      // Update local state
      // setServices([...services, { ...addedService, isEnabled: true }]);
      
      // Close the dialog
      setIsAddServiceOpen(false);
      
      // Reset the form
      setNewService({ name: "", category: "", subcategory: "" });
    } catch (error) {
      console.error("Error adding new service:", error);
    }
  };

  if (user?.user_type !== "USER" || !user.organization) {
    return <div>You are not associated with any organization or don't have the right permissions.</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold">Manage Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search services..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <Select
              onValueChange={(value) =>
                table.getColumn("category")?.setFilterValue(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Automotive">Automotive</SelectItem>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="Gardening">Gardening</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                table.getColumn("subcategory")?.setFilterValue(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Subcategories</SelectItem>
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
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Existing Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Existing Service</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Select
                    onValueChange={(value) => setNewService({ ...newService, name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Populate with existing services */}
                      <SelectItem value="service1">Service 1</SelectItem>
                      <SelectItem value="service2">Service 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value) => setNewService({ ...newService, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automotive">Automotive</SelectItem>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Gardening">Gardening</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value) => setNewService({ ...newService, subcategory: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddService}>Add to Organization</Button>
              </DialogContent>
            </Dialog>
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
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
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
        </CardContent>
      </Card>
      {selectedService && (
        <ServiceRequestManagement
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
      <div className="text-center mt-4">
        <p>
          If you want to request a new service to add, please visit the{" "}
          <Link to="/request-service" className="text-blue-600 hover:underline">
            Request to Add a Service
          </Link>{" "}
          section.
        </p>
      </div>
    </div>
  );
}

