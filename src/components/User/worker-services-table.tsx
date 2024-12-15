"use client"

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
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "@/hooks/use-toast"
import { getUserWorkerBookings } from "@/api/UserApis/bookingsApi"

type LabourAssignment = {
  assignmentId: number;
  bookingId: number;
  bookingDate: string;
  timeSlot: string;
  bookingNote: string;
  bookingStatus: string;
  totalOffers: number;
};

const columns: ColumnDef<LabourAssignment>[] = [
  {
    accessorKey: "requestNumber",
    header: "Request Number",
    cell: ({ row }) => {
      const bookingId = row.original.bookingId;
      const assignmentId = row.original.assignmentId;
      return <div>{`${bookingId}-${assignmentId}`}</div>;
    },
  },
  {
    accessorKey: "bookingDate",
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
    cell: ({ row }) => <div>{row.getValue("bookingDate")}</div>,
  },
  {
    accessorKey: "timeSlot",
    header: "Time Slot",
    cell: ({ row }) => <div>{row.getValue("timeSlot")}</div>,
  },
  {
    accessorKey: "bookingNote",
    header: "Booking Note",
    cell: ({ row }) => <div>{row.getValue("bookingNote")}</div>,
  },
  {
    accessorKey: "bookingStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("bookingStatus") as string;
      return (
        <Badge variant={status === "OPEN" ? "secondary" : "default"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalOffers",
    header: "Total Offers",
    cell: ({ row }) => <div>{row.getValue("totalOffers")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const assignment = row.original
      const navigate = useNavigate()

      const handleViewDetails = () => {
        navigate(`/worker-services/${assignment.bookingId}-${assignment.assignmentId}`)
      }

      const handleAcceptOffer = async () => {
        try {
          // Implement the API call to accept the offer
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

      const handleCancelAssignment = async () => {
        try {
          // Implement the API call to cancel the assignment
          toast({
            title: "Assignment Cancelled",
            description: "You have successfully cancelled the assignment.",
          })
          // Refresh the data or update the local state
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to cancel the assignment. Please try again.",
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
              onClick={() => navigator.clipboard.writeText(`${assignment.bookingId}-${assignment.assignmentId}`)}
            >
              Copy request number
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleViewDetails}>View details</DropdownMenuItem>
            {assignment.bookingStatus === "OPEN" && (
              <DropdownMenuItem onClick={handleAcceptOffer}>Accept offer</DropdownMenuItem>
            )}
            {assignment.bookingStatus !== "COMPLETED" && (
              <DropdownMenuItem onClick={handleCancelAssignment}>Cancel assignment</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function WorkerServicesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = useState<LabourAssignment[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserWorkerBookings()
        setData(response.flatMap((service: { bookingId: number, labourAssignments: LabourAssignment[] }) => 
          service.labourAssignments.map(assignment => ({
            ...assignment,
            bookingId: service.bookingId
          }))
        ))
      } catch (error) {
        console.error("Failed to fetch user worker bookings:", error)
        toast({
          title: "Error",
          description: "Failed to fetch user worker bookings. Please try again.",
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by request number..."
          value={(table.getColumn("requestNumber")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("requestNumber")?.setFilterValue(event.target.value)
          }
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

