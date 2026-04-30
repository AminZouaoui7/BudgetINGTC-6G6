import { MessageSquare, Clock, Users as UsersIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { activities, budgets, users } from '../data/mockData';

export function Collaborative() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Espace collaboratif</h1>
        <p className="text-gray-500">Gérez vos budgets partagés et collaborez en équipe</p>
      </div>

      {/* Team Members */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-[#0879bf]" />
            <h3 className="font-semibold text-gray-900">Membres de l'équipe</h3>
            <Badge variant="primary">{users.length} membres</Badge>
          </div>
          <Button variant="outline" size="sm">
            Inviter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex flex-col items-center text-center">
                <Avatar name={user.name} size="lg" className="mb-3" />
                <h4 className="font-medium text-gray-900 mb-1">{user.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                <Badge variant={user.role === 'admin' ? 'primary' : 'info'} className="text-xs">
                  {user.role === 'admin' ? 'Admin' : 'Membre'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Shared Budgets */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-1">Budgets partagés</h3>
          <p className="text-sm text-gray-500">Suivez vos budgets collaboratifs</p>
        </div>

        <div className="space-y-4">
          {budgets
            .filter(b => b.isShared)
            .map((budget) => {
              const percentage = (budget.spent / budget.amount) * 100;

              return (
                <div key={budget.id} className="p-4 rounded-lg bg-[#f0f8ff] hover:bg-[#e1f1fd] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{budget.name}</h4>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: budget.category.color }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        {budget.spent.toLocaleString()}€ / {budget.amount.toLocaleString()}€
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      {budget.members?.slice(0, 3).map((member) => (
                        <Avatar key={member.id} name={member.name} size="sm" />
                      ))}
                      {budget.members && budget.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                          +{budget.members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-white rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#3eb3f2] to-[#0879bf]"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </Card>

      {/* Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-[#0879bf]" />
            <h3 className="font-semibold text-gray-900">Activité récente</h3>
          </div>

          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <Avatar name={activity.user.name} size="sm" />
                  {index < activities.length - 1 && (
                    <div className="flex-1 w-px bg-[#bce3fb] mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{activity.user.name}</p>
                    <span className="text-xs text-gray-400">{activity.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.details}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Comments Section */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-[#0879bf]" />
            <h3 className="font-semibold text-gray-900">Commentaires</h3>
          </div>

          <div className="space-y-4 mb-4">
            <div className="flex gap-3">
              <Avatar name="Thomas Martin" size="sm" />
              <div className="flex-1 bg-[#f0f8ff] rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Thomas Martin</span>
                  <span className="text-xs text-gray-400">Il y a 2h</span>
                </div>
                <p className="text-sm text-gray-600">
                  On devrait peut-être réduire le budget loisirs ce mois-ci ?
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Avatar name="Sophie Bernard" size="sm" />
              <div className="flex-1 bg-[#f0f8ff] rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Sophie Bernard</span>
                  <span className="text-xs text-gray-400">Il y a 5h</span>
                </div>
                <p className="text-sm text-gray-600">
                  J'ai ajouté les courses de la semaine dans le budget alimentation
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Avatar name="Marie Dubois" size="sm" />
            <input
              type="text"
              placeholder="Écrire un commentaire..."
              className="flex-1 px-4 py-2 bg-[#f0f8ff] border border-[#bce3fb] rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#81cdf8]"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
