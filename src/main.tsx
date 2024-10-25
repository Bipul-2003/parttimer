import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import "./index.css";
import ServicesPage from "./pages/ServicesPage.tsx";
import RequestedServicesPage from "./pages/RequestedServicesPage.tsx";
import UserProfilePage from "./pages/userProfilePage.tsx";
// import OrganOrganizationPage from "./pages/OrganizationPage.tsx";
import ServiceRequestManager from "./components/Organization/ServiceRequestManager.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import SubscriptionsPage from "./pages/SubscriptionPage.tsx";
import DetailedServiceRequestPage from "./pages/DetailedRequestPage.tsx";
import OrganizationPage from "./pages/OrganizationPage.tsx";
import OrgDashboard from "./components/Organization/OrgDashboard.tsx";
import { EmployeeManagement } from "./components/Organization/EmployeeManagement.tsx";
import { ManageService } from "./components/Organization/ManageServices.tsx";
import { RequestService } from "./components/Organization/RequestService.tsx";
import { PaymentManagement } from "./components/Organization/PaymentManagement.tsx";
import { OrgTransaction } from "./components/Organization/OrgTransactions.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/requests/:requestId",
        element: <DetailedServiceRequestPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "/services",
        element: <ServicesPage />,
      },
      {
        path: "/requested-services",
        element: <RequestedServicesPage />,
      },
      {
        path: "/profile",
        element: <UserProfilePage />,
      },
      {
        path: "/organization/:orgId/*",
        element: <OrganizationPage />,
        children: [
          {
            path: "dashboard",
            element: <OrgDashboard />,
          },
          {
            path: "people/employees",
            element: <EmployeeManagement />,
          },
          {
            path: "people/owners",
            element: <OrgDashboard />,
          },
          {
            path: "services/manage",
            element: <ManageService />,
          },
          {
            path: "services/request",
            element: <RequestService />,
          },
          {
            path: "service-assignment",
            element: <OrgDashboard />,
          },
          {
            path: "subscription",
            element: <OrgDashboard />,
          },
          {
            path: "details",
            element: <OrgDashboard />,
          },
          {
            path: "payments/epm",
            element: <PaymentManagement />,
          },
          {
            path: "payments/manage",
            element: <OrgTransaction />,
          },
          {
            path: "settings",
            element: <OrgDashboard />,
          },
          {
            index: true,
            element: <OrgDashboard />,
          },
        ],
      },
      {
        path: "/subscriptions",
        element: <SubscriptionsPage />,
      },
      {
        path: "/test",
        element: <ServiceRequestManager />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
