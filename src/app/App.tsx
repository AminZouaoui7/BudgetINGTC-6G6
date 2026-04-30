import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
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
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App Routes */}
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/transactions" element={<AppLayout><Transactions /></AppLayout>} />
        <Route path="/budgets" element={<AppLayout><Budgets /></AppLayout>} />
        <Route path="/categories" element={<AppLayout><Categories /></AppLayout>} />
        <Route path="/statistics" element={<AppLayout><Statistics /></AppLayout>} />
        <Route path="/collaborative" element={<AppLayout><Collaborative /></AppLayout>} />
        <Route path="/alerts" element={<AppLayout><Alerts /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
