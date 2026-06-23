import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import AuthScreen from '../pages/AuthScreen';
import TrackerDashboard from '../pages/TrackerDashboard';
import UserProfile from '../pages/UserProfile';
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
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);