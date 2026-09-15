import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Guards
import ProtectedRoute from './guards/ProtectedRoute';
import GuestRoute from './guards/GuestRoute';

// Feature Pages
import LoginPage from '../../features/auth/pages/LoginPage';
import HomePage from '../../features/home/pages/HomePage';
import DashboardPage from '../../features/dashboard/pages/DashboardPage';
import InboxPage from '../../features/inbox/pages/InboxPage';
import ContactsPage from '../../features/contacts/pages/ContactsPage';
import WhatsAppPage from '../../features/whatsapp/pages/WhatsAppPage';
import AutomationsPage from '../../features/automations/pages/AutomationsPage';
import CampaignsPage from '../../features/campaigns/pages/CampaignsPage';
import AnalyticsPage from '../../features/analytics/pages/AnalyticsPage';
import TeamPage from '../../features/team/pages/TeamPage';
import BillingPage from '../../features/billing/pages/BillingPage';

export const router = createBrowserRouter([
  // Public Route (Landing Home Page accesible para todos)
  {
    path: '/home',
    element: <HomePage />,
  },

  // Guest Routes (Autenticación)
  {
    element: <GuestRoute />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: '',
            element: <Navigate to="/auth/login" replace />,
          },
        ],
      },
    ],
  },

  // Protected Routes (CRM Multi-Tenant)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'inbox',
            element: <InboxPage />,
          },
          {
            path: 'contacts',
            element: <ContactsPage />,
          },
          {
            path: 'whatsapp',
            element: <WhatsAppPage />,
          },
          {
            path: 'automations',
            element: <AutomationsPage />,
          },
          {
            path: 'campaigns',
            element: <CampaignsPage />,
          },
          {
            path: 'analytics',
            element: <AnalyticsPage />,
          },
          {
            path: 'team',
            element: <TeamPage />,
          },
          {
            path: 'billing',
            element: <BillingPage />,
          },
        ],
      },
    ],
  },

  // Catch-all
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);