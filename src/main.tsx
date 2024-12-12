import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import App from "./App.tsx";
import "./index.css";
import ServicesPage from "./pages/ServicesPage.tsx";
import RequestedServicesPage from "./pages/RequestedServicesPage.tsx";
import UserProfilePage from "./pages/userProfilePage.tsx";
import ServiceRequestManager from "./components/Organization/ServiceRequestManager.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SubscriptionsPage from "./pages/SubscriptionPage.tsx";
import DetailedServiceRequestPage from "./pages/DetailedRequestPage.tsx";
import OrganizationPage from "./pages/OrganizationPage.tsx";
import OrgDashboard from "./components/Organization/OrgDashboard.tsx";
import { EmployeeManagement } from "./components/Organization/EmployeeManagement.tsx";
import { ManageService } from "./components/Organization/ManageServices.tsx";
import { RequestService } from "./components/Organization/RequestService.tsx";
import { PaymentManagement } from "./components/Organization/PaymentManagement.tsx";
import { OrgTransaction } from "./components/Organization/OrgTransactions.tsx";
import ServiceSettings from "./components/Organization/ServiceSettings.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
import SignupPage1 from "./pages/SignUpPage1.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import OrgSettingsPage from "./components/Organization/OrganizationSettings.tsx";
import PointsManagement from "./pages/PointsManagementPage.tsx";
import { LanguageProvider } from "./context/LanguageContext.tsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.ts";
import { LaborBookingForm } from "./pages/BookLaborersPage.tsx";
import { WorkerDashboard } from "./components/Workers/WorkersDashbord.tsx";
import WorkersPage from "./pages/WorkersPage.tsx";

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
        element: (
          <ProtectedRoute>
            <DetailedServiceRequestPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage1 />,
      },
      {
        path: "/bookLaborers",
        element:<LaborBookingForm/>
      },
      {
        path: "/services",
        element: (
          <ProtectedRoute>
            <ServicesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/points",
        element: (
          // <ProtectedRoute>
          <PointsManagement />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/requested-services",
        element: (
          <ProtectedRoute>
            <RequestedServicesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/organization",
        element: (
          <ProtectedRoute>
            <OrganizationPage />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: (
              <ProtectedRoute requiredRole="OWNER">
                <OrgDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "settings",
            element: (
              <ProtectedRoute requiredRole="OWNER">
                <OrgSettingsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "people/employees",
            element: (
              <ProtectedRoute requiredRole="OWNER">
                <EmployeeManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: "people/owners",
            element: (
              <ProtectedRoute requiredRole="OWNER">
                <OrgDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "services/manage",
            element: (
              <ProtectedRoute requiredRole="OWNER">
                <ManageService />
              </ProtectedRoute>
            ),
          },
          {
            path: "services/request",
            element: (
              <ProtectedRoute requiredRole="OWNER">
                <RequestService />
              </ProtectedRoute>
            ),
          },
          {
            path: "payments/epm",
            element: (
              <ProtectedRoute requiredRole="ADMIN">
                <PaymentManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: "payments/manage",
            element: (
              <ProtectedRoute requiredRole="OWNER">
                <OrgTransaction />
              </ProtectedRoute>
            ),
          },
          {
            path: "settings/",
            element: (
              <ProtectedRoute requiredRole="OWNER">
                <ServiceSettings />
              </ProtectedRoute>
            ),
          },
          {
            path: "service-request-management/:requestId/*",
            element: (
              <ProtectedRoute requiredRole="CO_OWNER">
                <ServiceRequestManager />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/worker",
        element: (
          <ProtectedRoute requiredRole="OWNER">
            <WorkersPage />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <WorkerDashboard />,
          },
        ],
      },
      {
        path: "/subscriptions",
        element: (
          // <ProtectedRoute>
          <SubscriptionsPage />
          // </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </LanguageProvider>
    </I18nextProvider>
  </StrictMode>
);

