import { ReactElement } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Loader } from "../components/ui/Loader";
import { useAuth } from "../hooks/useAuth";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { IncomeOutcomePage } from "../pages/dashboard/IncomeOutcomePage";
import { SummaryPage } from "../pages/dashboard/SummaryPage";
import { ExpensesPage } from "../pages/expenses/ExpensesPage";
import { ProfilePage } from "../pages/profile/ProfilePage";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, isBootstrapped } = useAuth();

  if (!isBootstrapped) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const GuestRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, isBootstrapped } = useAuth();

  if (!isBootstrapped) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ExpensesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/summary"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SummaryPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/income-outcome"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <IncomeOutcomePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes;
