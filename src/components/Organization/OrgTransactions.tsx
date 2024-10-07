import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Download, CalendarIcon } from "lucide-react"
import { format, addDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import jsPDF from "jspdf"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { motion, AnimatePresence } from "framer-motion"

type Payment = {
  id: string
  sender: string
  receiver: string
  senderEmail: string
  receiverEmail: string
  date: string
  mode: "Bank Transfer" | "PayPal" | "Credit Card" | "Cash"
  status: "Completed" | "Pending" | "Failed"
  amount: number
}

const paymentModes = ["Bank Transfer", "PayPal", "Credit Card", "Cash"]
const statuses = ["Completed", "Pending", "Failed"]

const formSchema = z.object({
  sender: z.string().min(2, "Sender name must be at least 2 characters"),
  senderEmail: z.string().email("Invalid email address"),
  receiver: z.string().min(2, "Receiver name must be at least 2 characters"),
  receiverEmail: z.string().email("Invalid email address"),
  amount: z.number().positive("Amount must be positive"),
  mode: z.enum(["Bank Transfer", "PayPal", "Credit Card", "Cash"]),
})

const dummyPayments: Payment[] = [
  {
    id: "PAY001",
    sender: "John Doe",
    receiver: "Jane Smith",
    senderEmail: "john@example.com",
    receiverEmail: "jane@example.com",
    date: "2023-07-01",
    mode: "Bank Transfer",
    status: "Completed",
    amount: 1000,
  },
  {
    id: "PAY002",
    sender: "Alice Johnson",
    receiver: "Bob Williams",
    senderEmail: "alice@example.com",
    receiverEmail: "bob@example.com",
    date: "2023-07-02",
    mode: "PayPal",
    status: "Pending",
    amount: 750,
  },
  {
    id: "PAY003",
    sender: "Emma Brown",
    receiver: "Michael Davis",
    senderEmail: "emma@example.com",
    receiverEmail: "michael@example.com",
    date: "2023-07-03",
    mode: "Credit Card",
    status: "Failed",
    amount: 500,
  },
  {
    id: "PAY004",
    sender: "Oliver Wilson",
    receiver: "Sophia Taylor",
    senderEmail: "oliver@example.com",
    receiverEmail: "sophia@example.com",
    date: "2023-07-04",
    mode: "Cash",
    status: "Completed",
    amount: 250,
  },
  {
    id: "PAY005",
    sender: "James Anderson",
    receiver: "Emily Thomas",
    senderEmail: "james@example.com",
    receiverEmail: "emily@example.com",
    date: "2023-07-05",
    mode: "Bank Transfer",
    status: "Pending",
    amount: 1500,
  },
]

export function OrgTransaction() {
  const [payments, setPayments] = useState<Payment[]>(dummyPayments)
  const [filters, setFilters] = useState({
    search: "",
    dateRange: {
      from: new Date(2023, 6, 1),
      to: addDays(new Date(2023, 6, 1), 20),
    } as DateRange | undefined,
    mode: "",
    status: "",
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sender: "",
      senderEmail: "",
      receiver: "",
      receiverEmail: "",
      amount: 0,
      mode: "Bank Transfer",
    },
  })

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value })
  }

  const filteredPayments = payments.filter((payment) => {
    return (
      (filters.search === "" ||
        payment.sender.toLowerCase().includes(filters.search.toLowerCase()) ||
        payment.receiver.toLowerCase().includes(filters.search.toLowerCase()) ||
        payment.senderEmail
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        payment.receiverEmail
          .toLowerCase()
          .includes(filters.search.toLowerCase())) &&
      (filters.mode === "" || payment.mode === filters.mode) &&
      (filters.status === "" || payment.status === filters.status) &&
      (!filters.dateRange?.from ||
        !filters.dateRange?.to ||
        (new Date(payment.date) >= filters.dateRange.from &&
          new Date(payment.date) <= filters.dateRange.to))
    )
  })

  const downloadReceipt = (payment: Payment) => {
    const doc = new jsPDF()
    
    // Set font
    doc.setFont("helvetica")
    
    // Add "RECEIPT" header
    doc.setFontSize(40)
    doc.setTextColor(0, 0, 128) // Navy blue color
    doc.text("RECEIPT", 20, 30)
    
    // Add logo placeholder
    doc.setDrawColor(200)
    doc.circle(180, 25, 15)
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text("LOGO", 173, 28)
    
    // Add sender info
    doc.setFontSize(12)
    doc.setTextColor(0)
    doc.text("Your Company Name", 20, 50)
    doc.setFontSize(10)
    doc.text("123 Company Street", 20, 56)
    doc.text("City, State 12345", 20, 62)
    
    // Add recipient info
    doc.setFontSize(12)
    doc.text("BILL TO", 20, 80)
    doc.setFontSize(10)
    doc.text(payment.receiver, 20, 86)
    doc.text(payment.receiverEmail, 20, 92)
    
    // Add receipt details
    doc.setFontSize(10)
    doc.text(`Receipt #: ${payment.id}`, 140, 80)
    doc.text(`Receipt Date: ${payment.date}`, 140, 86)
    doc.text(`Due Date: ${payment.date}`, 140, 92) // Using same date for simplicity
    
    // Add table headers
    doc.setFillColor('240')
    doc.rect(20, 100, 170, 10, "F")
    doc.setTextColor(0)
    doc.text("Description", 25, 107)
    doc.text("Amount", 170, 107, { align: "right" })
    
    // Add table content
    doc.text("Payment", 25, 120)
    doc.text(`$${payment.amount.toFixed(2)}`, 170, 120, { align: "right" })
    
    // Add total
    doc.line(20, 130, 190, 130)
    doc.setFont("helvetica", "bold")
    doc.text("Total", 150, 140)
    doc.text(`$${payment.amount.toFixed(2)}`, 170, 140, { align: "right" })
    
    // Add "Thank you" message
    doc.setFont("helvetica", "normal")
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 128) // Navy blue color
    doc.text("Thank you", 20, 180)
    
    // Add terms and conditions
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text("Terms & Conditions", 20, 200)
    doc.text("Payment is due within 30 days", 20, 206)
    doc.text("Please make payment to:", 20, 212)
    doc.text("Bank: YourBank", 20, 218)
    doc.text("Account Number: 1234567890", 20, 224)
    doc.text("Routing Number: 987654321", 20, 230)
    
    doc.save(`receipt_${payment.id}.pdf`)
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const newPayment: Payment = {
      id: `PAY${(payments.length + 1).toString().padStart(3, "0")}`,
      sender: data.sender,
      receiver: data.receiver,
      senderEmail: data.senderEmail,
      receiverEmail: data.receiverEmail,
      date: format(new Date(), "yyyy-MM-dd"),
      mode: data.mode,
      status: "Completed",
      amount: data.amount,
    }
    setPayments([newPayment, ...payments])
    form.reset()
  }

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6"
      >
        Payment Dashboard
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap gap-4 mb-6"
      >
        <Input
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="max-w-xs"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !filters.dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange?.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                    {format(filters.dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(filters.dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange?.from}
              selected={filters.dateRange}
              onSelect={(dateRange) =>
                handleFilterChange("dateRange", dateRange)
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Select onValueChange={(value) => handleFilterChange("mode", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            {paymentModes.map((mode) => (
              <SelectItem key={mode} value={mode}>
                {mode}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => handleFilterChange("status", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Transaction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Transaction</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new transaction.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sender</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="senderEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sender Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="receiver"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Receiver</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="receiverEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Receiver Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" step="0.01" onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Mode</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentModes.map((mode) => (
                              <SelectItem key={mode} value={mode}>
                                {mode}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit">Create Transaction</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence>
          {filteredPayments.map((payment) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Transaction {payment.id}
                  </CardTitle>
                  <Badge
                    variant={
                      payment.status === "Completed"
                        ? "default"
                        : payment.status === "Pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {payment.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Sender:</span>
                      <span className="text-sm">{payment.sender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Receiver:</span>
                      <span className="text-sm">{payment.receiver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Amount:</span>
                      <span className="text-sm">${payment.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Date:</span>
                      <span className="text-sm">{payment.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Mode:</span>
                      <span className="text-sm">{payment.mode}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => downloadReceipt(payment)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}