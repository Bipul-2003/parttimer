import { useState, useCallback } from "react"
import { getOpenWorkerBookings } from "@/api/WorkerApis"

export type LaborRequest = {
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

export function useRequests() {
  const [requests, setRequests] = useState<LaborRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getOpenWorkerBookings()
      setRequests(
        response.map((item: any) => ({
          id: item.id.toString(),
          requestNumber: item.bookingId.toString(),
          date: new Date(item.bookingDate),
          timeSlot: item.timeSlot,
          status: item.bookingStatus,
          description: item.bookingNote,
          location: item.city,
          zipcode: item.zipcode,
          city: item.city,
        })),
      )
    } catch (error) {
      console.error("Error fetching requests:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { requests, isLoading, error, fetchRequests, setRequests }
}

