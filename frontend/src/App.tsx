import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RequestLeave from "./pages/RequestLeave";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import useUserStore from "./store/useUserStore";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const { user, isAuthenticated, logout, getCurrentUser } = useUserStore();

  // Check for user in localStorage on component mount
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  // Protected Route component
  const ProtectedRoute = ({ children, requireAdmin = false }) => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !user.isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }

    return (
      <>
        <Navbar user={user} onLogout={logout} />
        {children}
      </>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Register />
                )
              }
            />

            <Route
              path="/dashboard"
              element={
                user?.isAdmin ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <ProtectedRoute>
                    <Dashboard user={user} />
                  </ProtectedRoute>
                )
              }
            />

            <Route
              path="/request-leave"
              element={
                user?.isAdmin ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <ProtectedRoute>
                    <RequestLeave user={user} />
                  </ProtectedRoute>
                )
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/"
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
