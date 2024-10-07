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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown } from "lucide-react"
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

const employees: Employee[] = [
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

const areas = ["North", "South", "East", "West", "Central"]
const designations = ["Senior Cleaner", "Handyman", "Gardener", "Electrician", "Plumber"]
const statuses = ["Working", "Available", "On Leave"]

const columns: ColumnDef<Employee>[] = [
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
    accessorKey: "area",
    header: "Area",
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
    accessorKey: "designation",
    header: "Designation",
  },
  // {
  //   accessorKey: "totalEarnings",
  //   header: "Total Earnings",
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("totalEarnings"))
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount)
  //     return <div className="font-medium">{formatted}</div>
  //   },
  // },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("rating")} / 5</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Pay</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              Pay {row.original.name} (ID: {row.original.id})
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                defaultValue={row.original.totalEarnings / 12} // Monthly salary estimate
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentMethod" className="text-right">
                Payment Method
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Note
              </Label>
              <Textarea id="note" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
]

export function PaymentManagement() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: employees,
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

  // const totalBalance = 1058484   // This would typically come from your backend
  // const totalEarnings = employees.reduce((sum, employee) => sum + employee.totalEarnings, 0)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Employee Payment Management</CardTitle>
        <div className="flex justify-between items-center mt-4">
          <div className="text-2xl font-semibold">
            {/* Total Balance: <span className="text-green-600">${totalBalance.toLocaleString()}</span> */}
          </div>
          {/* <div className="text-xl">
            Total Earnings: <span className="text-blue-600">${totalEarnings.toLocaleString()}</span>
          </div> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select
            onValueChange={(value) =>
              table.getColumn("area")?.setFilterValue(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) =>
              table.getColumn("designation")?.setFilterValue(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Designations</SelectItem>
              {designations.map((designation) => (
                <SelectItem key={designation} value={designation}>{designation}</SelectItem>
              ))}
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