
// import { useState, useEffect } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { DatePickerWithRange } from "@/components/ui/date-range-picker"
// import { Loader2, Calendar, DollarSign, User, Briefcase } from "lucide-react"
// import { format } from "date-fns"

// type Payment = {
//   id: string
//   employeeName: string
//   employeeId: string
//   amount: number
//   status: 'Pending' | 'Completed' | 'Failed'
//   date: string
//   paymentType: 'Salary' | 'Bonus' | 'Reimbursement'
//   designation: string
// }

// const designations = ["Senior Cleaner", "Handyman", "Gardener", "Electrician", "Plumber"]
// const statuses = ["Pending", "Completed", "Failed"]
// const paymentTypes = ["Salary", "Bonus", "Reimbursement"]

// // This would typically come from an API
// const fetchPayments = (page: number, filters: any): Promise<Payment[]> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const payments: Payment[] = Array.from({ length: 20 }, (_, i) => ({
//         id: `PAY${(page * 20 + i + 1).toString().padStart(3, '0')}`,
//         employeeName: `Employee ${page * 20 + i + 1}`,
//         employeeId: `EMP${(page * 20 + i + 1).toString().padStart(3, '0')}`,
//         amount: Math.floor(Math.random() * 5000) + 1000,
//         status: statuses[Math.floor(Math.random() * statuses.length)] as 'Pending' | 'Completed' | 'Failed',
//         date: format(new Date(2023, 0, 1 + Math.floor(Math.random() * 365)), 'yyyy-MM-dd'),
//         paymentType: paymentTypes[Math.floor(Math.random() * paymentTypes.length)] as 'Salary' | 'Bonus' | 'Reimbursement',
//         designation: designations[Math.floor(Math.random() * designations.length)],
//       }))
//       resolve(payments)
//     }, 1000) // Simulate network delay
//   })
// }

// export function PaymentHistory() {
//   const [payments, setPayments] = useState<Payment[]>([])
//   const [page, setPage] = useState(0)
//   const [loading, setLoading] = useState(false)
//   const [hasMore, setHasMore] = useState(true)
//   const [filters, setFilters] = useState({
//     dateRange: { from: undefined, to: undefined },
//     status: '',
//     paymentType: '',
//     designation: '',
//     search: '',
//   })

//   const loadMorePayments = async () => {
//     if (loading || !hasMore) return
//     setLoading(true)
//     const newPayments = await fetchPayments(page, filters)
//     setPayments([...payments, ...newPayments])
//     setPage(page + 1)
//     setLoading(false)
//     if (newPayments.length < 20) setHasMore(false)
//   }

//   useEffect(() => {
//     loadMorePayments()
//   }, [])

//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + document.documentElement.scrollTop
//         >= document.documentElement.offsetHeight - 100
//       ) {
//         loadMorePayments()
//       }
//     }

//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [payments, loading, hasMore])

//   const handleFilterChange = (key: string, value: any) => {
//     setFilters({ ...filters, [key]: value })
//     setPayments([])
//     setPage(0)
//     setHasMore(true)
//   }

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold">Payment History</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="flex flex-wrap gap-4 mb-6">
//           <div className="flex-1 min-w-[200px]">
//             <Label htmlFor="search">Search by Name</Label>
//             <Input
//               id="search"
//               placeholder="Search employee name..."
//               value={filters.search}
//               onChange={(e) => handleFilterChange('search', e.target.value)}
//               className="mt-1"
//             />
//           </div>
//           <div className="flex-1 min-w-[200px]">
//             <Label>Date Range</Label>
//             <DatePickerWithRange 
//               className="mt-1"
//               onSelect={(range) => handleFilterChange('dateRange', range)}
//             />
//           </div>
//           <div className="flex-1 min-w-[200px]">
//             <Label>Status</Label>
//             <Select onValueChange={(value) => handleFilterChange('status', value)}>
//               <SelectTrigger className="mt-1">
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="">All Statuses</SelectItem>
//                 {statuses.map((status) => (
//                   <SelectItem key={status} value={status}>{status}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="flex-1 min-w-[200px]">
//             <Label>Payment Type</Label>
//             <Select onValueChange={(value) => handleFilterChange('paymentType', value)}>
//               <SelectTrigger className="mt-1">
//                 <SelectValue placeholder="Select payment type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="">All Types</SelectItem>
//                 {paymentTypes.map((type) => (
//                   <SelectItem key={type} value={type}>{type}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="flex-1 min-w-[200px]">
//             <Label>Designation</Label>
//             <Select onValueChange={(value) => handleFilterChange('designation', value)}>
//               <SelectTrigger className="mt-1">
//                 <SelectValue placeholder="Select designation" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="">All Designations</SelectItem>
//                 {designations.map((designation) => (
//                   <SelectItem key={designation} value={designation}>{designation}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {payments.map((payment) => (
//             <Card key={payment.id} className="flex flex-col">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Payment {payment.id}
//                 </CardTitle>
//                 <Badge variant={
//                   payment.status === 'Completed' ? 'success' :
//                   payment.status === 'Pending' ? 'warning' : 'destructive'
//                 }>
//                   {payment.status}
//                 </Badge>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-2">
//                   <div className="flex items-center">
//                     <User className="mr-2 h-4 w-4 opacity-70" />
//                     <span className="text-sm font-medium">{payment.employeeName}</span>
//                   </div>
//                   <div className="flex items-center text-sm text-muted-foreground">
//                     <span className="ml-6">ID: {payment.employeeId}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <DollarSign className="mr-2 h-4 w-4 opacity-70" />
//                     <span className="text-sm font-medium">${payment.amount.toLocaleString()}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Calendar className="mr-2 h-4 w-4 opacity-70" />
//                     <span className="text-sm">{payment.date}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Briefcase className="mr-2 h-4 w-4 opacity-70" />
//                     <span className="text-sm">{payment.designation}</span>
//                   </div>
//                   <div className="mt-2">
//                     <Badge variant="outline">{payment.paymentType}</Badge>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//         {loading && (
//           <div className="flex justify-center items-center mt-4">
//             <Loader2 className="h-6 w-6 animate-spin" />
//           </div>
//         )}
//         {!hasMore && (
//           <div className="text-center mt-4 text-gray-500">
//             No more payments to load.
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }