import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PartTimeServicesTable } from "./part-time-services-table"
import { WorkerServicesTable } from "./worker-services-table"
import { useAuth } from "@/context/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserDashboard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login')
      } else if (user.user_type === 'LABOUR') {
        navigate('/profile/myprofile')
      }
    }
  }, [user, loading, navigate])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!user || user.user_type !== 'USER') {
    return null // This will be handled by the useEffect hook above
  }

  return (
    <div className="container mx-auto space-y-4">
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-bold">Welcome back, {user.name}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-200">{user.email}</p>
          <p className="text-sm text-gray-200 mt-2">Points: {user.points}</p>
          {user.organization && (
            <p className="text-sm text-gray-200 mt-2">Organization: {user.organization.name}</p>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="part-time" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="part-time" className="text-sm font-medium">
                Part-time Services
              </TabsTrigger>
              <TabsTrigger value="worker" className="text-sm font-medium">
                Worker Services
              </TabsTrigger>
            </TabsList>
            <TabsContent value="part-time">
              <PartTimeServicesTable />
            </TabsContent>
            <TabsContent value="worker">
              <WorkerServicesTable />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto space-y-4">
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardHeader className="pb-0">
          <Skeleton className="h-6 w-1/3 bg-white/20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/4 bg-white/20 mt-2" />
          <Skeleton className="h-4 w-1/5 bg-white/20 mt-2" />
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

