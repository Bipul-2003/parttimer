import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserDashboard from '@/components/UserDashboard'
import UserProfile from '@/components/UserProfile'
import UserOrganization from '@/components/UserOrganization'
import UserHistory from '@/components/UserHistory'
import UserSettings from '@/components/UserSettings'
import Sidebar from '@/components/Sidebar'

const mockUser = {
  name: "Alice Johnson",
  email: "alice@example.com",
  avatar: "/placeholder.svg?height=100&width=100",
  role: "User",
  organization: "TechCorp Inc.",
  joinDate: "2021-03-15",
}

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [user, setUser] = useState(mockUser)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.id]: e.target.value })
  }

  const handleSaveChanges = () => {
    console.log("Saving user changes:", user)
    // Here you would typically send the updated user data to your backend
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          {/* <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1> */}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="hidden">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <UserDashboard user={user} />
            </TabsContent>

            <TabsContent value="profile">
              <UserProfile user={user} handleInputChange={handleInputChange} handleSaveChanges={handleSaveChanges} />
            </TabsContent>

            <TabsContent value="organization">
              <UserOrganization user={user} />
            </TabsContent>

            <TabsContent value="history">
              <UserHistory />
            </TabsContent>

            <TabsContent value="settings">
              <UserSettings />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}