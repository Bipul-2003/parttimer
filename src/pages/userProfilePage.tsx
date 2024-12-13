import { useState } from 'react'
import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import { HomeIcon, UserIcon, BriefcaseIcon, ClockIcon, Settings, CreditCard } from 'lucide-react'
import { Sidebar, SidebarItem } from '@/components/Sidebar/Sidebar';

interface Organization {
  id: number;
  name: string;
}

interface User {
  user_role: string;
  user_id: number;
  organization?: Organization;
  name: string;
  email: string;
  points: number;
}

const demoUser: User = {
  user_role: "User",
  user_id: 1,
  organization: { id: 1, name: "Demo Corp" },
  name: "John Doe",
  email: "john.doe@example.com",
  points: 1000
};

const sidebarItems: SidebarItem[] = [
  { icon: HomeIcon, label: "Dashboard", path: "dashboard" },
  { icon: UserIcon, label: "Profile", path: "profile" },
  // { icon: BriefcaseIcon, label: "Organization", path: "organization" },
  { icon: ClockIcon, label: "History", path: "history" },
  { icon: CreditCard, label: "Subscriptions", path: "subscription" },
  { icon: Settings, label: "Settings", path: "settings" },
]

export default function UserProfilePage() {
  const [user, setUser] = useState<User>(demoUser)

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar items={sidebarItems} basePath="/profile" title="MyProfile" />
      <main className="flex-1 p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          {/* Routed content will be rendered here */}
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}

