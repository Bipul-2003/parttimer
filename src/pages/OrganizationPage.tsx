import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet, useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

const CustomIcon = ({
  Icon,
  className,
  width = 20,
  height = 20,
}: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
  width?: number;
  height?: number;
}) => <Icon width={width} height={height} className={className} />;

const sidebarItems = [
  {
    icon: BarChart3,
    label: "Dashboard",
    path: "dashboard",
  },
  {
    icon: Users,
    label: "People",
    path: "people",
    children: [
      { label: "Employee management", path: "employees" },
      { label: "Owners", path: "owners" },
    ],
  },
  {
    icon: ClipboardList,
    label: "Services",
    path: "services",
    children: [
      { label: "Manage Services", path: "services/manage" },
      { label: "Request New Service", path: "request" },
    ],
  },
  {
    icon: UserCog,
    label: "Service Assignment",
    path: "service-assignment",
  },
  {
    icon: CreditCard,
    label: "Subscription",
    path: "subscription",
  },
  {
    icon: Building,
    label: "Organization Details",
    path: "details",
  },
  {
    icon: DollarSign,
    label: "Payments",
    path: "payments",
    children: [
      { label: "EPM", path: "epm" },
      { label: "Manage Payment", path: "manage" },
    ],
  },
  {
    icon: Settings,
    label: "Settings",
    path: "settings",
  },
];

export default function OrganizationPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const { orgId } = useParams<{ orgId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    const newActiveItem = sidebarItems.find(
      (item) =>
        item.path === path ||
        item.children?.some((child) => child.path === path)
    );
    if (newActiveItem) {
      setActiveItem(newActiveItem.label);
    }
  }, [location]);

  const handleNavigation = (path: string, label: string) => {
    setActiveItem(label);
    navigate(`/organization/${orgId}/${path}`);
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
                            {item.children.map((child, childIndex) => (
                              <Button
                                key={childIndex}
                                variant="ghost"
                                className={`w-full justify-start py-2 px-4 mb-1 ${
                                  activeItem === child.label
                                    ? "bg-purple-100 text-purple-700"
                                    : "text-gray-600 hover:text-purple-700 hover:bg-purple-50"
                                }`}
                                onClick={() =>
                                  handleNavigation(child.path, child.label)
                                }
                              >
                                {child.label}
                              </Button>
                            ))}
                          </AccordionContent>
                        )}
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start py-2 px-4 mb-1 ${
                            activeItem === item.label
                              ? "bg-purple-100 text-purple-700"
                              : "text-gray-600 hover:text-purple-700 hover:bg-purple-50"
                          } ${isCollapsed ? "justify-center" : ""}`}
                          onClick={() =>
                            handleNavigation(item.path, item.label)
                          }
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
                  )}
                </div>
              ))}
            </TooltipProvider>
          </nav>
        </ScrollArea>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
