import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

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
    // Public auth routes
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },
    { path: '/verify-email', element: <VerifyOtpPage /> },
    { path: '/forgot-password', element: <ForgotPasswordPage /> },
    { path: '/reset-password/:token', element: <ResetPasswordPage /> },

    // Protected invite routes (standalone full-screen, no AppLayout)
    {
        path: '/invite/accept/:token',
        element: (
            <ProtectedRoute>
                <AcceptInvitePage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/invite/reject/:token',
        element: (
            <ProtectedRoute>
                <RejectInvitePage />
            </ProtectedRoute>
        ),
    },

    // Protected app routes
    {
        element: (
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: '/', element: <DashboardPage /> },
            { path: '/groups', element: <GroupsPage /> },
            { path: '/groups/:groupId', element: <GroupDetailPage /> },
            { path: '/activity', element: <ActivityPage /> },
            { path: '/notifications', element: <ActivityPage /> },
            { path: '/profile', element: <ProfilePage /> },
        ],
    },
]);

export default router;

