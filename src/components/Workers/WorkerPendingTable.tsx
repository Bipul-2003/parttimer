import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { getWorkerPendingRequests, changeOfferPrice } from "@/api/WorkerApis"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

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

function PriceChangeDialog({
  isOpen,
  onClose,
  onSubmit,
}: { isOpen: boolean; onClose: () => void; onSubmit: (price: number) => void }) {
  const [newPrice, setNewPrice] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    const price = Number.parseFloat(newPrice)
    if (!isNaN(price)) {
      setIsLoading(true)
      await onSubmit(price)
      setIsLoading(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Offer Price</DialogTitle>
          <DialogDescription>Enter the new offer price below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-price" className="text-right">
              New Price
            </Label>
            <Input
              id="new-price"
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function WorkerPendingRequestsTable() {
  const [data, setData] = useState<PendingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const navigate = useNavigate()
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false)
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null)

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

  const handleChangeOfferPrice = (offerId: number) => {
    setSelectedOfferId(offerId)
    setIsPriceDialogOpen(true)
  }

  const handlePriceSubmit = async (newPrice: number) => {
    if (selectedOfferId === null) return

    try {
      await changeOfferPrice(newPrice, selectedOfferId)
      toast({
        title: "Success",
        description: "Offer price updated successfully.",
      })
      fetchData() // Refresh the data
      setIsPriceDialogOpen(false) // Close the dialog
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
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
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
          const amount = Number.parseFloat(row.getValue("offeredPrice"))
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
        cell: ({ row }) => <Badge variant="secondary">{row.getValue("status")}</Badge>,
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
                <DropdownMenuCheckboxItem onClick={() => navigate(`/worker/labor-request/${request.offerId}`)}>
                  View Details
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={() => handleChangeOfferPrice(request.offerId)}>
                  Change Offer Price
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [navigate, handleChangeOfferPrice],
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
          onChange={(event) => table.getColumn("bookingAddress")?.setFilterValue(event.target.value)}
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
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
      <PriceChangeDialog
        isOpen={isPriceDialogOpen}
        onClose={() => setIsPriceDialogOpen(false)}
        onSubmit={handlePriceSubmit}
      />
    </div>
  )
}

