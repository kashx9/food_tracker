import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import AuthScreen from '../pages/AuthScreen';
import HealthMetricsPage from '../pages/HealthMetricsPage';
import TrackerDashboard from '../pages/TrackerDashboard';
import UserProfile from '../pages/UserProfile';
import Dashboard from '../pages/UserDashboard';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/auth",
    element: <AuthScreen />,
  },
  {
    path: "/health-setup",
    element: (
      <ProtectedRoute>
        <HealthMetricsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tracker",
    element: (
      <ProtectedRoute>
        <TrackerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard/>
      </ProtectedRoute>
    )
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
