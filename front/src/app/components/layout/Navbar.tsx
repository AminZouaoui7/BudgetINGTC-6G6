import { Search, Bell, Plus, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-20 px-6">
      <div className="h-full flex items-center justify-between gap-4">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher transactions, budgets, catégories..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#81cdf8] focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          

          <button
            onClick={() => navigate('/alerts')}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Alertes"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Profil"
          >
            <div className="w-8 h-8 rounded-full bg-[#e8f6ff] flex items-center justify-center">
              <User className="w-4 h-4 text-[#0879bf]" />
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">
                {user?.fullName || 'Utilisateur'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </p>
            </div>
          </button>

          {user?.role === 'admin' && (
            <Badge variant="success">
              Admin
            </Badge>
          )}

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Déconnexion"
          >
            <LogOut className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
}