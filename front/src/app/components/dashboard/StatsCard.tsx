import { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

export function StatsCard({ title, value, icon, trend, color }: StatsCardProps) {
  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-medium">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          className={`w-12 h-12 rounded-xl flex items-center justify-center`}
          style={{ background: color }}
        >
          <div className="text-white">
            {icon}
          </div>
        </motion.div>
      </div>
    </Card>
  );
}
