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
import WorkersPage from "./pages/WorkersPage.tsx";
import UserDashboard from "./components/User/UserDashboard.tsx";
import UserProfile from "./components/User/UserProfile.tsx";
import UserOrganization from "./components/User/UserOrganization.tsx";
import UserHistory from "./components/User/UserHistory.tsx";
import UserSubscription from "./components/User/UserSubscrions.tsx";
import UserSettings from "./components/User/UserSettings.tsx";
import { UserWorkerServiceReqestDetailsPage } from "./pages/UserWorkerServiceReqestDetailsPage.tsx";
import WorkerHistoryTable from "./components/Workers/WorkerHistoryTable.tsx";
import { NotFound } from "./components/NotFound.tsx";
import LaborRequestDetails from "./components/Workers/WorkerRequestDetails.tsx";
// import AdvertisementPage from './components/Advertisements/AdsHome.tsx';
import AdsPage from "./pages/AdsPage.tsx";
import AdsHome from "./components/Advertisements/AdsHome.tsx";
import ShopDetailPage from "./components/Advertisements/ShopDeatiledPage.tsx";
import PublishAdPage from "./components/Advertisements/PublishAdPage.tsx";
import MyAdsPage from "./components/Advertisements/MyAdsPage.tsx";
import ManageAdPage from "./components/Advertisements/ManageAdPage.tsx";
import WorkerPendingRequestsTable from "./components/Workers/WorkerPendingTable.tsx";
import WorkerDashboard from "./components/Workers/WokerOpenTable.tsx";

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
        path: "/book-laborers",
        element: <LaborBookingForm />,
      },
      {
        path: "/advertisement",
        element: <AdsPage />,
        children: [
          {
            index: true,
            element: <AdsHome />,
          },
          {
            path: ":id",
            element: <ShopDetailPage />,
          },
          {
            path: "publish-ad",
            element: <PublishAdPage />,
          },
          {
            path: "my-ads",
            element: <MyAdsPage />,
          },
          {
            path: "manage-ad/:id",
            element: <ManageAdPage />,
          },
        ],
      },
      {
        path: "/services",
        element: (
          // <ProtectedRoute>
          <ServicesPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/points",
        element: (
          <ProtectedRoute>
            <PointsManagement />
          </ProtectedRoute>
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
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <UserDashboard />,
          },
          {
            path: "myprofile",
            element: <UserProfile />,
          },
          {
            path: "organization",
            element: <UserOrganization />,
          },
          {
            path: "history",
            element: <UserHistory />,
          },
          {
            path: "subscription",
            element: <UserSubscription />,
          },
          {
            path: "settings",
            element: <UserSettings />,
          },
        ],
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
              <ProtectedRoute requiredRole="OWNER">
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
          <ProtectedRoute requiredRole="LABOUR">
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
          {
            path: "history",
            element: <WorkerHistoryTable />,
          },
          {
            path: "pending",
            element :<WorkerPendingRequestsTable/>
          },
          {
            path: "labor-request/:id",
            element: <LaborRequestDetails />,
          },
        ],
      },
      {
        path: "/worker-services/:serviceId",
        element: (
          <ProtectedRoute>
            <UserWorkerServiceReqestDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/subscriptions",
        element: (
          <ProtectedRoute>
            <SubscriptionsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
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
