import { useState } from "react";
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

const sidebarItems = [
  { icon: BarChart3, label: "Dashboard", component: OrgDashboard },
  {
    icon: Users,
    label: "People",
    children: [
      { label: "Employee management", component: EmployeeManagement },
      { label: "Owners", component: OrgDashboard },
    ],
  },
  {
    icon: ClipboardList,
    label: "Services",
    children: [
      { label: "Manage Services", component: ManageService },
      // { label: "Service Responses", component: OrgDashboard },
      { label: "Request New Service", component: RequestService },
    ],
  },
  { icon: UserCog, label: "Service Assignment", component: OrgDashboard },
  { icon: CreditCard, label: "Subscription", component: OrgDashboard },
  { icon: Building, label: "Organization Details", component: OrgDashboard },
  {
    icon: DollarSign,
    label: "Payments",
    children: [
      { label: "EPM", component: PaymentManagement },
      { label: "Manage Payment", component: OrgTransaction },
    ],
  },
  { icon: Settings, label: "Settings", component: OrgDashboard },
];

export default function OrganOrganizationPage() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [userRole,
    //  setUserRole
    ] = useState("admin"); // This would normally come from your auth system
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const ActiveComponent =
    sidebarItems
      .flatMap((item) => (item.children ? item.children : item))
      .find((item) => item.label === activeItem)?.component || OrgDashboard;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className={`bg-white shadow-md flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        }`}>
        <div
          className={`p-4 border-b border-gray-200 flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}>
          {!isCollapsed && (
            <h2 className="text-2xl font-bold text-purple-700">OrgHub</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-purple-700">
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
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={item.label} className="border-b-0">
                        <AccordionTrigger
                          className={`py-2 mx-4 text-gray-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors ${
                            isCollapsed ? "justify-center" : ""
                          }`}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex items-center">
                                <item.icon
                                  className={`w-5 h-5 ${
                                    isCollapsed ? "" : "mr-3"
                                  }`}
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
                          <AccordionContent className="pl-4">
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
                                    onClick={() => setActiveItem(child.label)}>
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
                            onClick={() => setActiveItem(item.label)}>
                            <item.icon
                              className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"}`}
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
        <ActiveComponent />
      </main>
    </div>
  );
}
