import { AlertTriangle, Info, Bell, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { alerts } from '../data/mockData';

export function Alerts() {
  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centre d'alertes</h1>
          <p className="text-gray-500">Suivez vos notifications importantes</p>
        </div>
        <Badge variant="danger">{unreadCount} non lues</Badge>
      </div>

      {/* Quick Actions */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            Tout marquer comme lu
          </Button>
          <Button variant="ghost" size="sm">
            Filtrer
          </Button>
        </div>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const typeConfig = {
            warning: {
              icon: AlertTriangle,
              bgColor: 'bg-yellow-50',
              iconColor: 'text-yellow-600',
              borderColor: 'border-yellow-200'
            },
            danger: {
              icon: AlertTriangle,
              bgColor: 'bg-red-50',
              iconColor: 'text-red-600',
              borderColor: 'border-red-200'
            },
            info: {
              icon: Info,
              bgColor: 'bg-blue-50',
              iconColor: 'text-blue-600',
              borderColor: 'border-blue-200'
            }
          };

          const config = typeConfig[alert.type];
          const Icon = config.icon;

          return (
            <Card
              key={alert.id}
              className={`p-4 border ${config.borderColor} ${!alert.isRead ? config.bgColor : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`font-medium ${!alert.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                      {alert.message}
                    </p>
                    {!alert.isRead && (
                      <div className="w-2 h-2 bg-[#0879bf] rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{alert.timestamp}</p>
                </div>

                {!alert.isRead && (
                  <Button variant="ghost" size="sm" className="flex-shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State for Read Alerts */}
      {unreadCount === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Tout est à jour !</h3>
          <p className="text-gray-500">Vous n'avez aucune alerte non lue</p>
        </Card>
      )}
    </div>
  );
}
