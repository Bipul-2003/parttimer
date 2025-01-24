// import { useState, useCallback, useMemo, useEffect } from "react"
// import { format } from "date-fns"
// import { MoreHorizontal, RefreshCw, Loader } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Skeleton } from "@/components/ui/skeleton"
// import { getOpenWorkerBookings, workerOfferPrice } from "@/api/WorkerApis"
// import {
//   type ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
//   getPaginationRowModel,
// } from "@tanstack/react-table"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// type LaborRequest = {
//   id: string
//   requestNumber: string
//   date: Date
//   timeSlot: string
//   status: "OPEN"
//   description: string
//   location: string
//   zipcode: string
//   city: string
// }

// export function WorkerDashboard() {
//   const [requests, setRequests] = useState<LaborRequest[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [rowSelection, setRowSelection] = useState({})
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [currentRequest, setCurrentRequest] = useState<LaborRequest | null>(null)
//   const [priceInput, setPriceInput] = useState("")
//   const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null)

//   const fetchRequests = useCallback(async () => {
//     try {
//       setIsLoading(true)
//       setError(null)
//       const response = await getOpenWorkerBookings()
//       setRequests(
//         response.map((item: any) => ({
//           id: item.id.toString(),
//           requestNumber: item.bookingId.toString(),
//           date: new Date(item.bookingDate),
//           timeSlot: item.timeSlot,
//           status: item.bookingStatus,
//           description: item.bookingNote,
//           location: item.city,
//           zipcode: item.zipcode,
//           city: item.city,
//         })),
//       )
//     } catch (error) {
//       console.error("Error fetching requests:", error)
//       setError(error instanceof Error ? error.message : "An unknown error occurred")
//       setAlert({ type: "error", message: "Failed to fetch labor requests. Please try again later." })
//     } finally {
//       setIsLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchRequests()
//   }, [fetchRequests])

//   const openDialog = useCallback((request: LaborRequest) => {
//     setCurrentRequest(request)
//     setIsDialogOpen(true)
//     setPriceInput("")
//   }, [])

//   const closeDialog = useCallback(() => {
//     setIsDialogOpen(false)
//     setCurrentRequest(null)
//     setIsSubmitting(false)
//     setPriceInput("")
//   }, [])

//   const handleOfferPrice = useCallback(
//     async (price: number) => {
//       if (!currentRequest) return

//       try {
//         setIsSubmitting(true)
//         await workerOfferPrice(currentRequest.id, price)
//         setRequests((prev) => prev.filter((request) => request.id !== currentRequest.id))
//         setAlert({ type: "success", message: `Offered price $${price} for request ${currentRequest.requestNumber}` })
//       } catch (error) {
//         setAlert({
//           type: "error",
//           message: error instanceof Error ? error.message : "Failed to offer price. Please try again.",
//         })
//       } finally {
//         setIsSubmitting(false)
//         closeDialog()
//       }
//     },
//     [currentRequest, closeDialog],
//   )

//   const columns: ColumnDef<LaborRequest>[] = useMemo(
//     () => [
//       {
//         accessorKey: "requestNumber",
//         header: "Request Number",
//       },
//       {
//         accessorKey: "date",
//         header: "Date",
//         cell: ({ row }) => format(row.getValue("date"), "PPP"),
//       },
//       {
//         accessorKey: "timeSlot",
//         header: "Time Slot",
//       },
//       {
//         accessorKey: "city",
//         header: "City",
//       },
//       {
//         accessorKey: "zipcode",
//         header: "Zipcode",
//       },
//       {
//         accessorKey: "description",
//         header: "Description",
//       },
//       {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ row }) => <Badge variant="secondary">{row.getValue("status")}</Badge>,
//       },
//       {
//         id: "actions",
//         cell: ({ row }) => {
//           const request = row.original
//           return (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="h-8 w-8 p-0">
//                   <span className="sr-only">Open menu</span>
//                   <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem onClick={() => navigator.clipboard.writeText(request.id)}>
//                   Copy request ID
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   onSelect={(e) => {
//                     e.preventDefault()
//                     openDialog(request)
//                   }}
//                 >
//                   Offer Price
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )
//         },
//       },
//     ],
//     [openDialog],
//   )

//   const table = useReactTable({
//     data: requests,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onRowSelectionChange: setRowSelection,
//     state: {
//       rowSelection,
//     },
//   })

//   const renderSkeletonLoader = useCallback(
//     () => (
//       <div className="w-full space-y-4">
//         <div className="flex items-center space-x-4">
//           <Skeleton className="h-10 w-[250px]" />
//           <Skeleton className="h-10 w-[200px]" />
//           <Skeleton className="h-10 w-[100px] ml-auto" />
//         </div>
//         {[...Array(5)].map((_, i) => (
//           <Skeleton key={i} className="h-16 w-full" />
//         ))}
//       </div>
//     ),
//     [],
//   )

//   useEffect(() => {
//     return () => {
//       // Cleanup function
//       setIsDialogOpen(false)
//       setCurrentRequest(null)
//       setIsSubmitting(false)
//       setPriceInput("")
//       setAlert(null)
//     }
//   }, [])

//   useEffect(() => {
//     if (alert) {
//       const timer = setTimeout(() => setAlert(null), 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [alert])

//   if (isLoading) {
//     return renderSkeletonLoader()
//   }

//   if (error) {
//     return <div>Error: {error}</div>
//   }

//   return (
//     <>
//       {alert && (
//         <Alert variant={alert.type === "error" ? "destructive" : "default"}>
//           <AlertTitle>{alert.type === "error" ? "Error" : "Success"}</AlertTitle>
//           <AlertDescription>{alert.message}</AlertDescription>
//         </Alert>
//       )}
//       <div className="bg-background">
//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <CardTitle>Available Labor Requests</CardTitle>
//                 <CardDescription>There are {requests.length} open labor requests available</CardDescription>
//               </div>
//               <Button onClick={fetchRequests} size="icon">
//                 <RefreshCw className="h-4 w-4" />
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="relative">
//               <Table>
//                 <TableHeader>
//                   {table.getHeaderGroups().map((headerGroup) => (
//                     <TableRow key={headerGroup.id}>
//                       {headerGroup.headers.map((header) => (
//                         <TableHead key={header.id}>
//                           {header.isPlaceholder
//                             ? null
//                             : flexRender(header.column.columnDef.header, header.getContext())}
//                         </TableHead>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </TableHeader>
//               </Table>
//               <div className="max-h-[400px] overflow-y-auto border border-t-0 rounded-b-lg">
//                 <Table>
//                   <TableBody>
//                     {table.getRowModel().rows?.length ? (
//                       table.getRowModel().rows.map((row) => (
//                         <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                           {row.getVisibleCells().map((cell) => (
//                             <TableCell key={cell.id}>
//                               {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={columns.length} className="h-24 text-center">
//                           No results.
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="flex items-center justify-end space-x-2 py-4">
//           <div className="flex-1 text-sm text-muted-foreground">
//             {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
//             selected.
//           </div>
//           <div className="space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => table.previousPage()}
//               disabled={!table.getCanPreviousPage()}
//             >
//               Previous
//             </Button>
//             <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
//               Next
//             </Button>
//           </div>
//         </div>
//       </div>

//       <Dialog open={isDialogOpen} onOpenChange={(open) => open || closeDialog()} modal>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Offer Price</DialogTitle>
//             <DialogDescription>Enter the price you want to offer for this request.</DialogDescription>
//           </DialogHeader>
//           <Input
//             id="price-input"
//             placeholder="Enter price"
//             type="number"
//             value={priceInput}
//             onChange={(e) => setPriceInput(e.target.value)}
//           />
//           <DialogFooter>
//             <Button
//               onClick={() => {
//                 const price = Number.parseFloat(priceInput)
//                 if (price && !isNaN(price) && price > 0) {
//                   handleOfferPrice(price)
//                 } else {
//                   setAlert({ type: "error", message: "Please enter a valid price." })
//                 }
//               }}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader className="mr-2 h-4 w-4 animate-spin" />
//                   Submitting
//                 </>
//               ) : (
//                 "Submit Offer"
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }

