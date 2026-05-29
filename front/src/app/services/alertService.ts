import api from './api';

export type AlertType = 'warning' | 'danger' | 'info';

export type Alert = {
  id: number;
  userId: number;
  type: AlertType;
  message: string;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
  timestamp?: string;
};

function normalizeAlert(alert: Alert): Alert {
  return {
    ...alert,
    type: alert.type ?? 'info',
    isRead: Boolean(alert.isRead),
    timestamp: alert.createdAt
      ? new Date(alert.createdAt).toLocaleString('fr-FR')
      : alert.timestamp ?? '',
  };
}

export const alertService = {
  async getAll(): Promise<Alert[]> {
    const response = await api.get('/alert');
    return (response.data.alerts || []).map(normalizeAlert);
  },

  async markAsRead(id: number): Promise<Alert> {
    const response = await api.put(`/alert/${id}/read`);
    return normalizeAlert(response.data.alert);
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/alert/read-all');
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/alert/${id}`);
  },
};