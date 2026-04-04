import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Public pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import FaqPage from './pages/public/FaqPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import VerifyOtpPage from './pages/auth/VerifyOtpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// App pages
import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/groups/GroupsPage';
import GroupDetailPage from './pages/groups/GroupDetailPage';
import ActivityPage from './pages/ActivityPage';
import ProfilePage from './pages/ProfilePage';

// Invite pages
import AcceptInvitePage from './pages/invite/AcceptInvitePage';
import RejectInvitePage from './pages/invite/RejectInvitePage';

const router = createBrowserRouter([
    // Public facing routes with layout
    {
        element: (
             <PublicRoute>
                 <PublicLayout />
             </PublicRoute>
        ),
        children: [
            { path: '/', element: <LandingPage /> },
            { path: '/about', element: <AboutPage /> },
            { path: '/contact', element: <ContactPage /> },
            { path: '/faq', element: <FaqPage /> },
        ]
    },

    // Public auth routes (standalone, no layout)
    { path: '/login', element: <PublicRoute><LoginPage /></PublicRoute> },
    { path: '/signup', element: <PublicRoute><SignupPage /></PublicRoute> },
    { path: '/verify-email', element: <PublicRoute><VerifyOtpPage /></PublicRoute> },
    { path: '/forgot-password', element: <PublicRoute><ForgotPasswordPage /></PublicRoute> },
    { path: '/reset-password/:token', element: <PublicRoute><ResetPasswordPage /></PublicRoute> },

    // Protected invite routes (standalone full-screen)
    {
        path: '/invite/accept/:token',
        element: <ProtectedRoute><AcceptInvitePage /></ProtectedRoute>,
    },
    {
        path: '/invite/reject/:token',
        element: <ProtectedRoute><RejectInvitePage /></ProtectedRoute>,
    },

    // Protected app routes
    {
        element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
        children: [
            { path: '/dashboard', element: <DashboardPage /> },
            { path: '/groups', element: <GroupsPage /> },
            { path: '/groups/:groupId', element: <GroupDetailPage /> },
            { path: '/activity', element: <ActivityPage /> },
            { path: '/notifications', element: <ActivityPage /> },
            { path: '/profile', element: <ProfilePage /> },
        ],
    },
]);

export default router;
