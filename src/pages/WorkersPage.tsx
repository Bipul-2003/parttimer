import { Outlet } from 'react-router-dom';
import { LayoutDashboard,ClipboardList,Clock } from 'lucide-react';
import { Sidebar, SidebarItem } from '@/components/Sidebar/Sidebar';

const sidebarItems: SidebarItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "dashboard",
  },
  {
    icon: Clock,
    label: "Pendings",
    path: "pending",
  },
  {
    icon: ClipboardList,
    label: "History",
    path: "history",
  }


];

export default function WorkersPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar items={sidebarItems} basePath="/worker" title="Worker Dashboard" />
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

