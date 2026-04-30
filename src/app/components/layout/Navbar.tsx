import { Search, Bell, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-[#bce3fb]/30 sticky top-0 z-10 px-6">
      <div className="h-full flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher transactions, budgets..."
              className="w-full pl-10 pr-4 py-2 bg-[#f0f8ff] border border-transparent rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#81cdf8] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Nouvelle transaction
          </Button>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-[#f0f8ff] rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
