import { useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Tag,
  BarChart3,
  Users,
  Bell,
  Settings,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Receipt, label: 'Transactions', path: '/transactions' },
  { icon: Wallet, label: 'Budgets', path: '/budgets' },
  { icon: Tag, label: 'Catégories', path: '/categories' },
  { icon: BarChart3, label: 'Statistiques', path: '/statistics' },
  { icon: Users, label: 'Collaboratif', path: '/collaborative' },
  { icon: Bell, label: 'Alertes', path: '/alerts' },
  { icon: Settings, label: 'Paramètres', path: '/settings' }
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="h-screen bg-white border-r border-[#bce3fb]/30 flex flex-col sticky top-0"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#bce3fb]/30">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#3eb3f2] to-[#0879bf] rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">BudgetPro</span>
          </motion.div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-[#f0f8ff] rounded-lg transition-colors"
        >
          <ChevronLeft
            className={`w-5 h-5 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#e1f1fd] to-[#f0f8ff] text-[#0879bf] font-medium'
                    : 'text-gray-600 hover:bg-[#f0f8ff] hover:text-[#0879bf]'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 bg-[#0879bf] rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-[#bce3fb]/30">
        <div className={`flex items-center gap-3 p-2 rounded-lg hover:bg-[#f0f8ff] cursor-pointer transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3eb3f2] to-[#0879bf] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            MD
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Marie Dubois</p>
              <p className="text-xs text-gray-500 truncate">Admin</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
