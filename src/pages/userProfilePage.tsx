import { useMemo } from "react";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  ClockIcon,
  Settings,
  CreditCard,
} from "lucide-react";
import { Sidebar, SidebarItem } from "@/components/Sidebar/Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function UserProfilePage() {
  const { user } = useAuth();

  const sidebarItems: SidebarItem[] = useMemo(() => {
    const items: SidebarItem[] = [
      { icon: UserIcon, label: "Profile", path: "profile" },
      { icon: CreditCard, label: "Subscriptions", path: "subscription" },
      { icon: Settings, label: "Settings", path: "settings" },
    ];

    if (user?.user_type === "USER") {
      items.unshift({ icon: HomeIcon, label: "Dashboard", path: "dashboard" });
      items.splice(3, 0, {
        icon: ClockIcon,
        label: "History",
        path: "history",
      });
    }

    if (user?.user_type === "USER" && user.organization) {
      items.splice(2, 0, {
        icon: BriefcaseIcon,
        label: "Organization",
        path: "organization",
      });
    }

    return items;
  }, [user]);

  if (!user) {
    return null; // Or render a loading state or redirect to login
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar items={sidebarItems} basePath="/profile" title="MyProfile" />
      <main className="flex-1 p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
