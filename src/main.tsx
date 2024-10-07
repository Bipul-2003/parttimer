import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import "./index.css";
import ServicesPage from "./pages/ServicesPage.tsx";
import RequestedServicesPage from "./pages/RequestedServicesPage.tsx";
import UserProfilePage from "./pages/userProfilePage.tsx";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import OrganOrganizationPage from "./pages/OrganizationPage.tsx";
import ServiceRequestManager from "./components/Organization/ServiceRequestManager.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
    children: [
      {
        path: "servicerequests",
        element:<ServiceRequestManager />,
      },
    ],
  },
  {
    path: "/srvicerequest",
    element:<ServiceRequestManager />,
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Navbar />
    <RouterProvider router={router} />
    <Footer />
  </StrictMode>
);
