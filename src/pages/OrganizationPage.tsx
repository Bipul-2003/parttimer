import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { RequestService } from "@/components/Organization/RequestService";
import { ManageService } from "@/components/Organization/ManageServices";
import { EmployeeManagement } from "@/components/Organization/EmployeeManagement";
import { PaymentManagement } from "@/components/Organization/PaymentManagement"; // Ensure this matches the actual file name
import { OrgTransaction } from "@/components/Organization/OrgTransactions"; // Ensure this matches the actual file name
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart3,
  Users,
  UserCog,
  ClipboardList,
  CreditCard,
  Building,
  Settings,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import OrgDashboard from "@/components/Organization/OrgDashboard";
import { dashboardAPI } from "@/api/dashboard";
import {
  Employee,
  DashboardStats,
  OrganizationService,
} from "@/types/dashboardTypes";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export interface DashboardComponentProps {
  stats: DashboardStats | null;
  employees: Employee[];
  services: OrganizationService[];
  loading: boolean;
  error: string | null;
  onUpdate: () => Promise<void>;
}

interface ComponentProps {
  label: string;
  component: React.ComponentType<DashboardComponentProps>;
}

interface SidebarItemBase {
  icon: React.ComponentType;
  label: string;
  path: string; // Add path property
}

interface SidebarItemWithComponent extends SidebarItemBase {
  component: React.ComponentType<DashboardComponentProps>;
  children?: never;
}

interface SidebarItemWithChildren extends SidebarItemBase {
  component?: never;
  children: (ComponentProps & { path: string })[]; // Add path to children
}
type SidebarItem = SidebarItemWithComponent | SidebarItemWithChildren;

interface DashboardState {
  stats: DashboardStats | null;
  employees: Employee[];
  services: OrganizationService[];
  loading: boolean;
  error: string | null;
}

const CustomIcon = ({
  Icon,
  className,
  width = 20,
  height = 20,
}: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Ensure the Icon can accept SVG props
  className?: string;
  width?: number;
  height?: number;
}) => <Icon width={width} height={height} className={className} />;

const sidebarItems: SidebarItem[] = [
  {
    icon: BarChart3,
    label: "Dashboard",
    path: "dashboard",
    component: OrgDashboard,
  },
  {
    icon: Users,
    label: "People",
    path: "people",
    children: [
      {
        label: "Employee management",
        path: "employees",
        component: EmployeeManagement,
      },
      {
        label: "Owners",
        path: "owners",
        component: OrgDashboard,
      },
    ],
  },
  {
    icon: ClipboardList,
    label: "Services",
    path: "services",
    children: [
      {
        label: "Manage Services",
        path: "manage",
        component: ManageService,
      },
      {
        label: "Request New Service",
        path: "request",
        component: RequestService,
      },
    ],
  },
  {
    icon: UserCog,
    label: "Service Assignment",
    path: "service-assignment",
    component: OrgDashboard,
  },
  {
    icon: CreditCard,
    label: "Subscription",
    path: "subscription",
    component: OrgDashboard,
  },
  {
    icon: Building,
    label: "Organization Details",
    path: "details",
    component: OrgDashboard,
  },
  {
    icon: DollarSign,
    label: "Payments",
    path: "payments",
    children: [
      {
        label: "EPM",
        path: "epm",
        component: PaymentManagement,
      },
      {
        label: "Manage Payment",
        path: "manage",
        component: OrgTransaction,
      },
    ],
  },
  {
    icon: Settings,
    label: "Settings",
    path: "settings",
    component: OrgDashboard,
  },
];

export default function OrganizationPage() {
  //OrganOrganizationPage
  //const [activeItem, setActiveItem] = useState("Dashboard");
  const [userRole, setUserRole] = useState<"admin" | "manager" | "employee">(
    "admin"
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    stats: null,
    employees: [],
    services: [],
    loading: true,
    error: null,
  });

  //const orgId = "http://localhost:8080/api";
  const { orgId } = useParams<{ orgId: string }>();

  const navigate = useNavigate();
  const location = useLocation();

  // Function to get active item based on current path
  const getActiveItemFromPath = () => {
    const path = location.pathname.split("/").pop();
    for (const item of sidebarItems) {
      if (item.path === path) return item.label;
      if (item.children) {
        const child = item.children.find((c) => c.path === path);
        if (child) return child.label;
      }
    }
    return "Dashboard";
  };

  const [activeItem, setActiveItem] = useState(getActiveItemFromPath());

  // Update activeItem when location changes
  useEffect(() => {
    setActiveItem(getActiveItemFromPath());
  }, [location]);

  // Function to handle navigation
  const handleNavigation = (
    item: SidebarItemBase | (ComponentProps & { path: string })
  ) => {
    setActiveItem(item.label);
    navigate(`/organization/${orgId}/${item.path}`);
  };

  // Effect to fetch initial data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardState((prev) => ({ ...prev, loading: true, error: null }));

        const [stats, employees, services] = await Promise.all([
          dashboardAPI.getDashboardStats(orgId as string),
          dashboardAPI.getEmployees(orgId as string),
          dashboardAPI.getServices(orgId as string),
        ]);

        setDashboardState({
          stats,
          employees,
          services,
          loading: false,
          error: null,
        });
      } catch (error) {
        setDashboardState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "An error occurred",
        }));
      }
    };

    fetchDashboardData();
  }, [orgId]);

  // Access control function
  const canAccess = (item: string) => {
    if (userRole === "admin") return true;
    if (userRole === "manager" && item !== "Owners" && item !== "Subscription")
      return true;
    if (
      userRole === "employee" &&
      ["Dashboard", "Service Requests", "Service Responses"].includes(item)
    )
      return true;
    return false;
  };

  const findActiveComponent =
    (): React.ComponentType<DashboardComponentProps> => {
      for (const item of sidebarItems) {
        if (item.component && item.label === activeItem) {
          return item.component;
        }
        if (item.children) {
          const childComponent = item.children.find(
            (child) => child.label === activeItem
          )?.component;
          if (childComponent) return childComponent;
        }
      }
      return OrgDashboard;
    };
  // Updated active component handling with proper typing
  const ActiveComponent = findActiveComponent();
  const handleUpdate = async () => {
    try {
      setDashboardState((prev) => ({ ...prev, loading: true, error: null }));
      const [stats, employees, services] = await Promise.all([
        dashboardAPI.getDashboardStats(orgId as string),
        dashboardAPI.getEmployees(orgId as string),
        dashboardAPI.getServices(orgId as string),
      ]);
      setDashboardState({
        stats,
        employees,
        services,
        loading: false,
        error: null,
      });
    } catch (error) {
      setDashboardState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      }));
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className={`bg-white shadow-md flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div
          className={`p-4 border-b border-gray-200 flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <h2 className="text-2xl font-bold text-purple-700">OrgHub</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-purple-700"
          >
            {isCollapsed ? (
              <ChevronRight size={24} />
            ) : (
              <ChevronLeft size={24} />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-grow">
          <nav className="p-2">
            <TooltipProvider>
              {sidebarItems.map((item, index) => (
                <div key={index} className="mb-2">
                  {item.children ? (
                    <Accordion type="single" collapsible>
                      <AccordionItem value={item.label}>
                        <AccordionTrigger className="px-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex items-center">
                                <CustomIcon
                                  Icon={item.icon}
                                  className={`${isCollapsed ? "" : "mr-3"}`}
                                />

                                {!isCollapsed && item.label}
                              </span>
                            </TooltipTrigger>
                            {isCollapsed && (
                              <TooltipContent side="right">
                                {item.label}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </AccordionTrigger>
                        {!isCollapsed && (
                          <AccordionContent>
                            {item.children.map(
                              (child, childIndex) =>
                                canAccess(child.label) && (
                                  <Button
                                    key={childIndex}
                                    variant="ghost"
                                    className={`w-full justify-start py-2 px-4 mb-1 ${
                                      activeItem === child.label
                                        ? "bg-purple-100 text-purple-700"
                                        : "text-gray-600 hover:text-purple-700 hover:bg-purple-50"
                                    }`}
                                    onClick={() => setActiveItem(child.label)}
                                  >
                                    {child.label}
                                  </Button>
                                )
                            )}
                          </AccordionContent>
                        )}
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    canAccess(item.label) && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start py-2 px-4 mb-1 ${
                              activeItem === item.label
                                ? "bg-purple-100 text-purple-700"
                                : "text-gray-600 hover:text-purple-700 hover:bg-purple-50"
                            } ${isCollapsed ? "justify-center" : ""}`}
                            onClick={() => setActiveItem(item.label)}
                          >
                            <CustomIcon
                              Icon={item.icon}
                              className={`${isCollapsed ? "" : "mr-3"}`}
                            />

                            {!isCollapsed && item.label}
                          </Button>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side="right">
                            {item.label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    )
                  )}
                </div>
              ))}
            </TooltipProvider>
          </nav>
        </ScrollArea>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {dashboardState.loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700" />
          </div>
        ) : dashboardState.error ? (
          <div className="text-red-500 text-center">{dashboardState.error}</div>
        ) : (
          <ActiveComponent {...dashboardState} onUpdate={handleUpdate} />
        )}
      </main>
    </div>
  );
}
