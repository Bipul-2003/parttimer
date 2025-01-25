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
import {  ChevronDown } from "lucide-react"

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
import { getOpenWorkerBookings, workerOfferPrice } from "@/api/WorkerApis"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
// import { format } from "date-fns"

type LaborRequest = {
    id: string
    requestNumber: string
    date: Date
    timeSlot: string
    status: "OPEN"
    description: string
    location: string
    zipcode: string
    city: string
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

export default function WorkerDashboard() {
  const [data, setData] = useState<LaborRequest[]>([])
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
      const response = await getOpenWorkerBookings()
      console.log(response);
      
      setData(response.map((item: any) => ({
        id: item.id.toString(),
        requestNumber: item.bookingId.toString(),
        date: new Date(item.bookingDate),
        timeSlot: item.timeSlot,
        status: item.bookingStatus,
        description: item.bookingNote,
        location: item.city,
        zipcode: item.zipcode,
        city: item.city,
      })))
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch  requests. Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangeOfferPrice = (offerId: number) => {
    setSelectedOfferId(offerId)
    setIsPriceDialogOpen(true)
  }

  const handlePriceSubmit = async (price: number) => {
    if (selectedOfferId === null) return

    try {
      await workerOfferPrice(selectedOfferId,price)
      toast({
        title: "Success",
        description: "Offer price sent successfully.",
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

  const columns = useMemo<ColumnDef<LaborRequest>[]>(
    () => [
        {
            accessorKey: "requestNumber",
            header: "Request Number",
          },
          {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => row.getValue("date"),
          },
          {
            accessorKey: "timeSlot",
            header: "Time Slot",
          },
          {
            accessorKey: "city",
            header: "City",
          },
          {
            accessorKey: "zipcode",
            header: "Zipcode",
          },
          {
            accessorKey: "description",
            header: "Description",
          },
          {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <Badge variant="secondary">{row.getValue("status")}</Badge>,
          },
      {
        id: "actions",
        enableHiding: false,
        header: "Action",
        cell: ({ row }) => {
          const request = row.original

          return (
            
                <Button onClick={() => handleChangeOfferPrice(Number(request.id))}>
                   Offer Price
                </Button>
             
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
        {/* <Input
          placeholder="Filter by address..."
          value={(table.getColumn("bookingAddress")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("bookingAddress")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        /> */}
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

