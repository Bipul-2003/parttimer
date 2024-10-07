
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Mail, Phone, MapPin, Calendar, DollarSign, Star, CheckCircle, XCircle, Briefcase } from "lucide-react"
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
} from "@tanstack/react-table"

type Employee = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  area: string
  status: 'Working' | 'Available' | 'On Leave'
  joinedDate: string
  totalEarnings: number
  currentService: string | null
  rating: number
  availableForRequests: boolean
  designation: string
  servicesDone: string[]
}

const data: Employee[] = [
  {
    id: "EMP001",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 234 567 8901",
    address: "123 Main St, Anytown, AN 12345",
    area: "North",
    status: "Working",
    joinedDate: "2022-03-15",
    totalEarnings: 45000,
    currentService: "House Cleaning",
    rating: 4.8,
    availableForRequests: false,
    designation: "Senior Cleaner",
    servicesDone: ["House Cleaning", "Office Cleaning", "Carpet Cleaning"],
  },
  {
    id: "EMP002",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+1 234 567 8902",
    address: "456 Oak Rd, Somewhere, SW 67890",
    area: "South",
    status: "Available",
    joinedDate: "2021-11-01",
    totalEarnings: 52000,
    currentService: null,
    rating: 4.5,
    availableForRequests: true,
    designation: "Handyman",
    servicesDone: ["Plumbing", "Electrical Work", "Furniture Assembly"],
  },
  {
    id: "EMP003",
    name: "Carol White",
    email: "carol@example.com",
    phone: "+1 234 567 8903",
    address: "789 Pine Ave, Elsewhere, EL 13579",
    area: "East",
    status: "On Leave",
    joinedDate: "2023-01-10",
    totalEarnings: 38000,
    currentService: null,
    rating: 4.2,
    availableForRequests: false,
    designation: "Gardener",
    servicesDone: ["Lawn Mowing", "Tree Trimming", "Flower Bed Maintenance"],
  },
]

const designations = [
  "Senior Cleaner",
  "Handyman",
  "Gardener",
  "Electrician",
  "Plumber",
  "Painter",
  "Carpenter",
]

const areas = ["North", "South", "East", "West", "Central"]

// Simulating the current user being the owner
const isOwner = true

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${row.original.name}`} />
            <AvatarFallback>{row.original.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>{row.getValue("name")}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === 'Working' ? 'default' : status === 'Available' ? 'outline' : 'secondary'}>
          {status}
        </Badge>
      )
    },
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
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "area",
    header: "Area",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">View Details</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{row.original.name}</DialogTitle>
            <DialogDescription>Employee ID: {row.original.id}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right"><Mail className="h-4 w-4" /></Label>
              <div className="col-span-3">{row.original.email}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right"><Phone className="h-4 w-4" /></Label>
              <div className="col-span-3">{row.original.phone}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right"><MapPin className="h-4 w-4" /></Label>
              <div className="col-span-3">{row.original.address}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right"><Calendar className="h-4 w-4" /></Label>
              <div className="col-span-3">Joined: {row.original.joinedDate}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right"><DollarSign className="h-4 w-4" /></Label>
              <div className="col-span-3">Total Earnings: ${row.original.totalEarnings}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right"><Star className="h-4 w-4" /></Label>
              <div className="col-span-3">
                Rating: {row.original.rating}
                <Progress value={row.original.rating * 20} className="mt-2" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Current Service</Label>
              <div className="col-span-3">{row.original.currentService || 'None'}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Available for Requests</Label>
              <div className="col-span-3">
                {row.original.availableForRequests ? 
                  <CheckCircle className="h-5 w-5 text-green-500" /> : 
                  <XCircle className="h-5 w-5 text-red-500" />
                }
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right"><Briefcase className="h-4 w-4" /></Label>
              <div className="col-span-3">
                {isOwner ? (
                  <Select defaultValue={row.original.designation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {designations.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  row.original.designation
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Services Done</Label>
              <div className="col-span-3">
                {row.original.servicesDone.map((service, index) => (
                  <Badge key={index} variant="outline" className="mr-2 mb-2">{service}</Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button>Contact Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
]

export function EmployeeManagement() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

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
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Employee Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 py-4">
          <div className="flex-1">
            <Input
              placeholder="Filter by name..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <Select
              onValueChange={(value) =>
                table.getColumn("area")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select
              onValueChange={(value) =>
                table.getColumn("designation")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Designations</SelectItem>
                {designations.map((designation) => (
                  <SelectItem key={designation} value={designation}>{designation}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
                  )
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
                    )
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
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
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
  )
}
