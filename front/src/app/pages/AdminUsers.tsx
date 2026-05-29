import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import type { User } from "../types";
import { userService } from "../../services/userService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Input } from "../components/ui/Input";

type EditableUser = User & {
  _dirty?: boolean;
  _saving?: boolean;
  _deleting?: boolean;
};

export function AdminUsers() {
  const [users, setUsers] = useState<EditableUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.email.toLowerCase().includes(q) ||
        user.fullName.toLowerCase().includes(q) ||
        String(user.id).includes(q)
      );
    });
  }, [search, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const items = await userService.getAll();
      setUsers(items.map((item) => ({ ...item, _dirty: false })));
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateLocal = (id: number, patch: Partial<EditableUser>) => {
    setUsers((previous) =>
      previous.map((user) => (user.id === id ? { ...user, ...patch, _dirty: true } : user)),
    );
  };

  const saveUser = async (target: EditableUser) => {
    setUsers((previous) =>
      previous.map((user) => (user.id === target.id ? { ...user, _saving: true } : user)),
    );

    try {
      const updated = await userService.update(target.id, {
        fullName: target.fullName,
        email: target.email,
        role: target.role,
        isActive: target.isActive,
      });
      setUsers((previous) =>
        previous.map((user) =>
          user.id === target.id ? { ...updated, _dirty: false, _saving: false } : user,
        ),
      );
      toast.success("Utilisateur mis à jour.");
    } catch (error: any) {
      setUsers((previous) =>
        previous.map((user) => (user.id === target.id ? { ...user, _saving: false } : user)),
      );
      toast.error(error?.response?.data?.message ?? error?.message ?? "Impossible de mettre à jour l'utilisateur.");
    }
  };

  const deleteUser = async (target: EditableUser) => {
    setUsers((previous) =>
      previous.map((user) => (user.id === target.id ? { ...user, _deleting: true } : user)),
    );

    try {
      await userService.remove(target.id);
      setUsers((previous) => previous.filter((user) => user.id !== target.id));
      toast.success("Utilisateur supprimé.");
    } catch (error: any) {
      setUsers((previous) =>
        previous.map((user) => (user.id === target.id ? { ...user, _deleting: false } : user)),
      );
      toast.error(error?.response?.data?.message ?? error?.message ?? "Impossible de supprimer l'utilisateur.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="text-gray-500">Gérez les utilisateurs de l’application</p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#0879bf]" />
          <h3 className="font-semibold text-gray-900">Utilisateurs</h3>
        </div>

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Input
              label="Recherche"
              placeholder="Id, nom, email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Button variant="outline" onClick={loadUsers} disabled={loading}>
            Actualiser
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Actif</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <input
                    value={item.fullName}
                    onChange={(event) => updateLocal(item.id, { fullName: event.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#bce3fb] rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#81cdf8]"
                  />
                </TableCell>
                <TableCell>
                  <input
                    value={item.email}
                    onChange={(event) => updateLocal(item.id, { email: event.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#bce3fb] rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#81cdf8]"
                  />
                </TableCell>
                <TableCell>
                  <select
                    value={item.role}
                    onChange={(event) =>
                      updateLocal(item.id, { role: event.target.value === "admin" ? "admin" : "user" })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#bce3fb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81cdf8]"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </TableCell>
                <TableCell>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={(event) => updateLocal(item.id, { isActive: event.target.checked })}
                      className="w-4 h-4 rounded border-[#bce3fb] text-[#0879bf] focus:ring-[#81cdf8]"
                    />
                    <span className="text-sm text-gray-700">{item.isActive ? "Oui" : "Non"}</span>
                  </label>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => saveUser(item)}
                      disabled={!item._dirty || item._saving || item._deleting}
                    >
                      Sauvegarder
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteUser(item)}
                      disabled={item._saving || item._deleting}
                    >
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!filteredUsers.length ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  {loading ? "Chargement..." : "Aucun utilisateur."}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

