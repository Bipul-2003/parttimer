import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { getWorkerPendingRequests, changeOfferPrice } from "@/api/WorkerApis"

interface PendingRequest {
  offerId: number
  labourAssignmentId: number
  labourId: number
  bookingId: number
  offeredPrice: number
  status: string
  bookingAddress: string
  bookingNote: string
  bookingDate: string
  timeSlot: string
  offerCreatedAt: string
}

export default function WorkerPendingRequestsTable() {
  const [data, setData] = useState<PendingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await getWorkerPendingRequests()
      setData(response)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch pending requests. Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangeOfferPrice = async (offerId: number) => {
    const newPrice = prompt("Enter new offer price:")
    if (newPrice === null) return

    const numericPrice = parseFloat(newPrice)
    if (isNaN(numericPrice)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid number for the new price.",
      })
      return
    }

    try {
      await changeOfferPrice(numericPrice, offerId)
      toast({
        title: "Success",
        description: "Offer price updated successfully.",
      })
      fetchData() // Refresh the data
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update offer price. Please try again.",
      })
    }
  }

  const columns = useMemo<ColumnDef<PendingRequest>[]>(
    () => [
      {
        accessorKey: "offerId",
        header: "Offer ID",
        cell: ({ row }) => <div className="capitalize">{row.getValue("offerId")}</div>,
      },
      {
        accessorKey: "bookingId",
        header: "Booking ID",
        cell: ({ row }) => <div className="lowercase">{row.getValue("bookingId")}</div>,
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
        accessorKey: "offeredPrice",
        header: () => <div className="text-right">Price</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("offeredPrice"))
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)
   
          return <div className="text-right font-medium">{formatted}</div>
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant="secondary">
            {row.getValue("status")}
          </Badge>
        ),
      },
      {
        accessorKey: "bookingAddress",
        header: "Address",
        cell: ({ row }) => <div>{row.getValue("bookingAddress")}</div>,
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const request = row.original
   
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  Actions <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuCheckboxItem
                  onClick={() => navigate(`/worker/labor-request/${request.offerId}`)}
                >
                  View Details
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  onClick={() => handleChangeOfferPrice(request.offerId)}
                >
                  Change Offer Price
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [navigate, handleChangeOfferPrice]
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
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

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[100px] ml-auto" />
        </div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="w-full bg-background p-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by address..."
          value={(table.getColumn("bookingAddress")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("bookingAddress")?.setFilterValue(event.target.value)
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
                  No pending requests.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

