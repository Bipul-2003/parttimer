import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import "./index.css";
import ServicesPage from "./pages/ServicesPage.tsx";
import RequestedServicesPage from "./pages/RequestedServicesPage.tsx";
import UserProfilePage from "./pages/userProfilePage.tsx";
import OrganOrganizationPage from "./pages/OrganizationPage.tsx";
import ServiceRequestManager from "./components/Organization/ServiceRequestManager.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import SubscriptionsPage from "./pages/SubscriptionPage.tsx";
import DetailedServiceRequestPage from "./pages/DetailedRequestPage.tsx";

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
        path: "/organization",
        element: <OrganOrganizationPage />,
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
