import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { BarChart3, Users, UserCog, ClipboardList, CreditCard, Building, Settings, DollarSign } from 'lucide-react';
import { Sidebar, SidebarItem } from "@/components/Sidebar/Sidebar";

const sidebarItems: SidebarItem[] = [
  {
    icon: BarChart3,
    label: "Dashboard",
    path: "dashboard",
    requiredRole: "OWNER",
  },
  {
    icon: Users,
    label: "People",
    path: "people",
    requiredRole: "OWNER",
    children: [
      { label: "Employee management", path: "people/employees" },
      { label: "Owners", path: "people/owners" },
    ],
  },
  {
    icon: ClipboardList,
    label: "Services",
    path: "services",
    requiredRole: "OWNER",
    children: [
      { label: "Manage Services", path: "services/manage" },
      { label: "Request New Service", path: "services/request" },
    ],
  },
  {
    icon: UserCog,
    label: "Service Assignment",
    path: "service-request-management",
    requiredRole: "CO_OWNER",
  },
  {
    icon: CreditCard,
    label: "Subscription",
    path: "subscriptions",
  },
  {
    icon: Building,
    label: "Organization Details",
    path: "settings",
    requiredRole: "OWNER",
  },
  {
    icon: DollarSign,
    label: "Payments",
    path: "payments",
    requiredRole: "OWNER",
    children: [
      { label: "EPM", path: "payments/epm", requiredRole: "ADMIN" },
      { label: "Manage Payment", path: "payments/manage" },
    ],
  },
  {
    icon: Settings,
    label: "Settings",
    path: "settings",
    requiredRole: "OWNER",
    children: [
      { label: "Service Settings", path: "settings" },
    ],
  },
];

export default function OrganizationPage() {
  const { user } = useAuth();

  // Function to check if the user is a RegularUser
  const isRegularUser = (user: any): user is { user_role: string; organization?: { id: number; name: string } } => {
    return user && 'user_role' in user;
  };

  // If user is null or undefined, show loading or error state
  if (!user) {
    return <div>Loading...</div>;
  }

  // Check if the user is a RegularUser and has an organization
  if (isRegularUser(user) && !user.organization) {
    return <div>You are not associated with any organization.</div>;
  }

  // If the user is a LabourUser, they shouldn't have access to this page
  if (!isRegularUser(user)) {
    return <div>Access denied. This page is only for organization members.</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar items={sidebarItems} basePath="/organization" title="OrgHub" />
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

