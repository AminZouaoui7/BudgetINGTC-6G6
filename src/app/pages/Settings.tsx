import { User, Lock, Bell, Globe, Palette } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { currentUser } from '../data/mockData';

export function Settings() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500">Gérez vos préférences et votre compte</p>
      </div>

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-[#0879bf]" />
          <h3 className="font-semibold text-gray-900">Profil utilisateur</h3>
        </div>

        <div className="flex items-start gap-6 mb-6">
          <Avatar name={currentUser.name} size="lg" />
          <div className="flex-1">
            <Button variant="outline" size="sm">
              Changer la photo
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Nom complet"
            defaultValue={currentUser.name}
          />
          <Input
            label="Email"
            type="email"
            defaultValue={currentUser.email}
          />
          <div className="flex justify-end pt-4">
            <Button variant="primary">
              Sauvegarder
            </Button>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-[#0879bf]" />
          <h3 className="font-semibold text-gray-900">Sécurité</h3>
        </div>

        <div className="space-y-4">
          <Input
            label="Mot de passe actuel"
            type="password"
            placeholder="••••••••"
          />
          <Input
            label="Nouveau mot de passe"
            type="password"
            placeholder="••••••••"
          />
          <Input
            label="Confirmer le nouveau mot de passe"
            type="password"
            placeholder="••••••••"
          />
          <div className="flex justify-end pt-4">
            <Button variant="primary">
              Modifier le mot de passe
            </Button>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-[#0879bf]" />
          <h3 className="font-semibold text-gray-900">Notifications</h3>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Alertes de dépassement de budget', checked: true },
            { label: 'Nouvelles transactions', checked: true },
            { label: 'Activité collaborative', checked: false },
            { label: 'Résumé mensuel', checked: true }
          ].map((notification, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f0f8ff] transition-colors">
              <span className="text-sm text-gray-900">{notification.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={notification.checked}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#81cdf8]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0879bf]"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-[#0879bf]" />
          <h3 className="font-semibold text-gray-900">Préférences</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-2" />
              Langue
            </label>
            <select className="w-full px-4 py-2.5 bg-white border border-[#bce3fb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81cdf8]">
              <option>Français</option>
              <option>English</option>
              <option>Español</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise
            </label>
            <select className="w-full px-4 py-2.5 bg-white border border-[#bce3fb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81cdf8]">
              <option>EUR (€)</option>
              <option>USD ($)</option>
              <option>GBP (£)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200">
        <h3 className="font-semibold text-red-600 mb-4">Zone dangereuse</h3>
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Supprimer le compte</p>
            <p className="text-sm text-gray-500">Cette action est irréversible</p>
          </div>
          <Button variant="danger">
            Supprimer
          </Button>
        </div>
      </Card>
    </div>
  );
}
