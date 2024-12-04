import { HomeIcon, UserIcon, BriefcaseIcon, ClockIcon, Settings } from "lucide-react"

const sidebarItems = [
  { icon: HomeIcon, label: "Dashboard", value: "dashboard" },
  { icon: UserIcon, label: "Profile", value: "profile" },
  { icon: BriefcaseIcon, label: "Organization", value: "organization" },
  { icon: ClockIcon, label: "History", value: "history" },
  { icon: Settings, label: "Settings", value: "settings" },
  { icon: Settings, label: "Subcriptions", value: "subscription" },
]

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-primary mb-4">MyProfile</h2>
        <nav>
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              className={`flex items-center w-full p-2 text-left ${
                activeTab === item.value
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-600 hover:bg-gray-100"
              } rounded-md mb-2`}
              onClick={() => setActiveTab(item.value)}>
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}