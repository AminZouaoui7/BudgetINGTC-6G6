import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Info,
  Bell,
  CheckCircle,
  Trash2,
  Loader2,
} from 'lucide-react';

import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { Alert } from '../types';
import { alertService } from '../../services/alertService';
import { getApiErrorMessage } from '../../services/api';
import { toast } from 'sonner';

type AlertType = 'warning' | 'danger' | 'info';

const typeConfig: Record<
  AlertType,
  {
    icon: typeof AlertTriangle;
    bgColor: string;
    iconColor: string;
    borderColor: string;
    label: string;
    badgeVariant: 'warning' | 'danger' | 'info';
  }
> = {
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    borderColor: 'border-yellow-200',
    label: 'Attention',
    badgeVariant: 'warning',
  },
  danger: {
    icon: AlertTriangle,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    borderColor: 'border-red-200',
    label: 'Urgent',
    badgeVariant: 'danger',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    label: 'Information',
    badgeVariant: 'info',
  },
};

function formatDate(alert: Alert) {
  const rawDate = alert.createdAt || alert.timestamp;

  if (!rawDate) return 'Date inconnue';

  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) {
    return String(rawDate);
  }

  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | AlertType>('all');

  const loadAlerts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await alertService.getAll();
      setAlerts(data);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAlerts();
  }, []);

  const unreadCount = useMemo(
    () => alerts.filter((alert) => !alert.isRead).length,
    [alerts]
  );

  const dangerCount = useMemo(
    () => alerts.filter((alert) => alert.type === 'danger').length,
    [alerts]
  );

  const warningCount = useMemo(
    () => alerts.filter((alert) => alert.type === 'warning').length,
    [alerts]
  );

  const filteredAlerts = useMemo(() => {
    if (filter === 'unread') {
      return alerts.filter((alert) => !alert.isRead);
    }

    if (filter === 'danger' || filter === 'warning' || filter === 'info') {
      return alerts.filter((alert) => alert.type === filter);
    }

    return alerts;
  }, [alerts, filter]);

  const handleMarkAllAsRead = async () => {
    try {
      setIsActionLoading(true);

      await alertService.markAllAsRead();

      setAlerts((current) =>
        current.map((alert) => ({
          ...alert,
          isRead: true,
        }))
      );

      toast.success('Toutes les alertes ont été marquées comme lues');
    } catch (markError) {
      toast.error(getApiErrorMessage(markError));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleMarkAsRead = async (alertId: number) => {
    try {
      await alertService.markAsRead(alertId);

      setAlerts((current) =>
        current.map((alert) =>
          alert.id === alertId ? { ...alert, isRead: true } : alert
        )
      );

      toast.success('Alerte marquée comme lue');
    } catch (markError) {
      toast.error(getApiErrorMessage(markError));
    }
  };

  const handleDelete = async (alertId: number) => {
    const confirmDelete = window.confirm(
      'Voulez-vous vraiment supprimer cette alerte ?'
    );

    if (!confirmDelete) return;

    try {
      await alertService.remove(alertId);

      setAlerts((current) => current.filter((alert) => alert.id !== alertId));
      toast.success('Alerte supprimée');
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#f0f8ff] flex items-center justify-center">
              <Bell className="w-6 h-6 text-[#0879bf]" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Centre d&apos;alertes
              </h1>
              <p className="text-gray-500">
                Suivez vos notifications importantes
              </p>
            </div>
          </div>
        </div>

        <Badge variant={unreadCount > 0 ? 'danger' : 'success'}>
          {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1">Alertes non lues</p>
          <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1">Alertes urgentes</p>
          <p className="text-2xl font-bold text-red-600">{dangerCount}</p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1">Avertissements</p>
          <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Toutes
            </Button>

            <Button
              variant={filter === 'unread' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Non lues
            </Button>

            <Button
              variant={filter === 'danger' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('danger')}
            >
              Urgentes
            </Button>

            <Button
              variant={filter === 'warning' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('warning')}
            >
              Avertissements
            </Button>

            <Button
              variant={filter === 'info' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('info')}
            >
              Infos
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={!alerts.length || unreadCount === 0 || isActionLoading}
            icon={
              isActionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )
            }
          >
            Tout marquer comme lu
          </Button>
        </div>
      </Card>

      {isLoading && (
        <Card className="p-10 text-center text-gray-500">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[#0879bf]" />
            Chargement des alertes...
          </div>
        </Card>
      )}

      {!isLoading && error && (
        <Card className="p-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Impossible de charger les alertes
              </h3>
              <p className="text-sm text-gray-600">{error}</p>

              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={loadAlerts}
              >
                Réessayer
              </Button>
            </div>
          </div>
        </Card>
      )}

      {!isLoading && !error && filteredAlerts.length > 0 && (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const config = typeConfig[(alert.type as AlertType) || 'info'] ?? typeConfig.info;
            const Icon = config.icon;

            return (
              <Card
                key={alert.id}
                className={`p-4 border ${config.borderColor} ${
                  !alert.isRead ? config.bgColor : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant={config.badgeVariant}>
                        {config.label}
                      </Badge>

                      {!alert.isRead && (
                        <span className="inline-flex items-center rounded-full bg-[#0879bf] px-2 py-0.5 text-[10px] font-semibold text-white">
                          Nouveau
                        </span>
                      )}
                    </div>

                    <p
                      className={`font-medium ${
                        !alert.isRead ? 'text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      {alert.message}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(alert)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!alert.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0"
                        onClick={() => handleMarkAsRead(alert.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0"
                      onClick={() => handleDelete(alert.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && !error && filteredAlerts.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h3 className="font-semibold text-gray-900 mb-2">
            Tout est à jour !
          </h3>

          <p className="text-gray-500">
            Aucune alerte ne correspond au filtre sélectionné.
          </p>
        </Card>
      )}
    </div>
  );
}