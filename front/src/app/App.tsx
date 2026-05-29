import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Budgets } from './pages/Budgets';
import { Categories } from './pages/Categories';
import { Statistics } from './pages/Statistics';
import { Collaborative } from './pages/Collaborative';
import { Alerts } from './pages/Alerts';
import { Settings } from './pages/Settings';
import { AdminUsers } from './pages/AdminUsers';
import { Toaster } from 'sonner';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#f0f8ff] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        <Route
          path="/dashboard"
          element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/transactions"
          element={<ProtectedRoute><AppLayout><Transactions /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/budgets"
          element={<ProtectedRoute><AppLayout><Budgets /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/categories"
          element={<ProtectedRoute><AppLayout><Categories /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/statistics"
          element={<ProtectedRoute><AppLayout><Statistics /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/collaborative"
          element={<ProtectedRoute><AppLayout><Collaborative /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/alerts"
          element={<ProtectedRoute><AppLayout><Alerts /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/admin/users"
          element={<ProtectedRoute adminOnly><AppLayout><AdminUsers /></AppLayout></ProtectedRoute>}
        />

        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
