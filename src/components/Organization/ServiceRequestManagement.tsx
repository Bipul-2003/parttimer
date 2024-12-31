import { useState, useEffect } from "react";
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
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
import { dashboardAPI } from "@/api/dashboard";
import { ServiceDelivery } from "@/types/dashboardTypes";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Link } from "react-router-dom";

interface ServiceRequestManagementProps {
  service: {
    id: number;
    name: string;
  };
  onClose: () => void;
}

export default function ServiceRequestManagement({
  service,
  onClose,
}: ServiceRequestManagementProps) {
  const [serviceRequests, setServiceRequests] = useState<ServiceDelivery[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceRequests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await dashboardAPI.fetchServiceDeliveries(service.id);
        setServiceRequests(data);
      } catch (error) {
        console.error("Error fetching service requests:", error);
        setError("Failed to load service requests. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceRequests();
  }, [service.id]);

  const columns: ColumnDef<ServiceDelivery>[] = [
    {
      accessorKey: "customerName",
      header: "Customer Name",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "assignedEmployees",
      header: "Assigned Employees",
      cell: ({ row }) => (
        <div>
          {row.original.assignedEmployees.map((employee) => (
            <div key={employee.userId}>{employee.name}</div>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "estimatedRevenue",
      header: "Est. Revenue",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("estimatedRevenue"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "area",
      header: "Area",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "time",
      header: "Time",
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${row.getValue("progress")}%` }}></div>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="outline">
          <Link to={`/service-request-management/${row.original.id}`}>Manage</Link>
        </Button>
        // <Dialog>
        //   <DialogTrigger asChild>
        //     <Button variant="outline">Manage</Button>
        //   </DialogTrigger>
        //   <DialogContent className="sm:max-w-[425px]">
        //     <DialogHeader>
        //       <DialogTitle>Manage Service Request</DialogTitle>
        //       <DialogDescription>
        //         Update the details of this service request.
        //       </DialogDescription>
        //     </DialogHeader>
        //     <div className="grid gap-4 py-4">
        //       <div className="grid grid-cols-4 items-center gap-4">
        //         <Label htmlFor="employees" className="text-right">
        //           Employees
        //         </Label>
        //         <Select>
        //           <SelectTrigger className="col-span-3">
        //             <SelectValue placeholder="Select employees" />
        //           </SelectTrigger>
        //           <SelectContent>
        //             {row.original.assignedEmployees.map((employee) => (
        //               <SelectItem key={employee.userId} value={employee.userId.toString()}>
        //                 {employee.name}
        //               </SelectItem>
        //             ))}
        //             <SelectItem value="add-new">Add New Employee</SelectItem>
        //           </SelectContent>
        //         </Select>
        //       </div>
        //       <div className="grid grid-cols-4 items-center gap-4">
        //         <Label htmlFor="status" className="text-right">
        //           Status
        //         </Label>
        //         <Select>
        //           <SelectTrigger className="col-span-3">
        //             <SelectValue placeholder={row.original.status} />
        //           </SelectTrigger>
        //           <SelectContent>
        //             <SelectItem value="pending">Pending</SelectItem>
        //             <SelectItem value="ongoing">Ongoing</SelectItem>
        //             <SelectItem value="completed">Completed</SelectItem>
        //           </SelectContent>
        //         </Select>
        //       </div>
        //       <div className="grid grid-cols-4 items-center gap-4">
        //         <Label htmlFor="progress" className="text-right">
        //           Progress
        //         </Label>
        //         <Input
        //           id="progress"
        //           type="number"
        //           className="col-span-3"
        //           defaultValue={row.original.progress}
        //         />
        //       </div>
        //       <div className="grid grid-cols-4 items-center gap-4">
        //         <Label htmlFor="notes" className="text-right">
        //           Notes
        //         </Label>
        //         <Textarea id="notes" className="col-span-3" />
        //       </div>
        //     </div>
        //     <DialogTrigger asChild>
        //       <Button type="submit">Save changes</Button>
        //     </DialogTrigger>
        //   </DialogContent>
        // </Dialog>
      ),
    },
  ];

  const table = useReactTable({
    data: serviceRequests,
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

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Service: {service.name}</CardTitle>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 mb-4">
          <div className="space-y-2 flex-1">
            <Label>Status</Label>
            <Select
              onValueChange={(value) =>
                table.getColumn("status")?.setFilterValue(value)
              }>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex-1">
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2 flex-1">
            <Label>Search</Label>
            <Input
              placeholder="Search requests..."
              value={
                (table.getColumn("customerName")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("customerName")
                  ?.setFilterValue(event.target.value)
              }
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="sr-only">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
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
        )}
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
  );
}
