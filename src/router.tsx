import { createBrowserRouter, Route } from "react-router-dom";
import GeneralError from "./pages/errors/general-error";
import NotFoundError from "./pages/errors/not-found-error";
import MaintenanceError from "./pages/errors/maintenance-error";
import UnauthorisedError from "./pages/errors/unauthorised-error.tsx";
import ProtectedRoute from "./pages/auth/components/ProtectedRoute.tsx";
import React from "react";
import Users from "./pages/users/index.tsx";
import Organizations from "./pages/organizations/index.tsx";
import SignIn from "./pages/auth/sign-in.tsx";
import AppShell from "./components/app-shell.tsx";

const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <SignIn />
      </React.Suspense>
    ), // Adjusted to use element and Suspense
  },

  // Main routes
  {
    path: "/",
    element: <AppShell />, // Directly use AppShell here
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Users />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Users />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "organizations",
        element: (
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Organizations />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Error routes
  { path: "/500", element: <GeneralError /> },
  { path: "/404", element: <NotFoundError /> },
  { path: "/503", element: <MaintenanceError /> },
  { path: "/401", element: <UnauthorisedError /> },

  // Fallback 404 route
  { path: "*", element: <NotFoundError /> },
]);

export default router;
