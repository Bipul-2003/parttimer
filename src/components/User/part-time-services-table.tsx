import * as React from "react"
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "@/hooks/use-toast"
import { getUserPartimeBookings } from "@/api/UserApis/bookingsApi"
import config from "@/config/config";

type PartTimeService = {
  bookingId: number
  date: string
  time: string
  city: string
  zipcode: string
  description: string
  status: string
  offeredPrice: number | null
  serviceName: string
}


const API_URL = config.apiURI;

const columns: ColumnDef<PartTimeService>[] = [
  {
    accessorKey: "bookingId",
    header: "Booking ID",
    cell: ({ row }) => <div>{row.getValue("bookingId")}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => <div>{row.getValue("time")}</div>,
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => <div>{row.getValue("city")}</div>,
  },
  {
    accessorKey: "zipcode",
    header: "Zipcode",
    cell: ({ row }) => <div>{row.getValue("zipcode")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "COMPLETED" ? "default" : "secondary"}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "offeredPrice",
    header: "Offered Price",
    cell: ({ row }) => {
      const price = row.getValue("offeredPrice") as number | null
      return <div>{price ? `$${price}` : "N/A"}</div>
    },
  },
  {
    accessorKey: "serviceName",
    header: "Service Name",
    cell: ({ row }) => <div>{row.getValue("serviceName")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const service = row.original
      const navigate = useNavigate()

      const handleViewDetails = () => {
        navigate(`/part-time-services/${service.bookingId}`)
      }

      const handleAcceptOffer = async () => {
        try {
          await axios.post(`${API_URL}/bookings/${service.bookingId}/accept`)
          toast({
            title: "Offer Accepted",
            description: "You have successfully accepted the offer.",
          })
          // Refresh the data or update the local state
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to accept the offer. Please try again.",
            variant: "destructive",
          })
        }
      }

      const handleCancelService = async () => {
        try {
          await axios.post(`${API_URL}/bookings/${service.bookingId}/cancel`)
          toast({
            title: "Service Cancelled",
            description: "You have successfully cancelled the service.",
          })
          // Refresh the data or update the local state
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to cancel the service. Please try again.",
            variant: "destructive",
          })
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(service.bookingId.toString())}
            >
              Copy booking ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleViewDetails}>View details</DropdownMenuItem>
            {service.status === "PRICE_OFFERED" && (
              <DropdownMenuItem onClick={handleAcceptOffer}>Accept offer</DropdownMenuItem>
            )}
            {service.status !== "COMPLETED" && (
              <DropdownMenuItem onClick={handleCancelService}>Cancel service</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function PartTimeServicesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = useState<PartTimeService[]>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserPartimeBookings();
        setData(response)
      } catch (error) {
        console.error("Failed to fetch user part-time bookings:", error)
        toast({
          title: "Error",
          description: "Failed to fetch user part-time bookings. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [])

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
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
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
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
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
    </div>
  )
}

