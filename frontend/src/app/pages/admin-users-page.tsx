import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Ban, Search, Shield, ShieldCheck, UserCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getAllUsers,
  getStats,
  changeUserRole,
  banUser,
  unbanUser,
  type AdminUserResponse,
  type AdminStatsResponse,
  type AdminUserRole,
  type AdminUserStatus,
} from "../api/admin-api";

function getRoleBadge(role: AdminUserRole) {
  switch (role) {
    case "ADMIN":
      return "bg-red-50 text-red-700";
    case "USER":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
}

function getRoleLabel(role: AdminUserRole) {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "USER":
      return "User";
    default:
      return role;
  }
}

function getStatusBadge(status: AdminUserStatus) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700";
    case "BANNED":
      return "bg-red-50 text-red-700";
    case "SUSPENDED":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
}

function getStatusLabel(status: AdminUserStatus) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "BANNED":
      return "Banned";
    case "SUSPENDED":
      return "Suspended";
    default:
      return status;
  }
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [usersData, statsData] = await Promise.all([
          getAllUsers(),
          getStats(),
        ]);
        setUsers(usersData);
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.nickname.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q)
    );
  }, [query, users]);

  async function handleChangeRole(user: AdminUserResponse) {
    const newRole: AdminUserRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    try {
      setActionLoading(user.id);
      const updated = await changeUserRole(user.id, newRole);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to change role");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleBan(user: AdminUserResponse) {
    try {
      setActionLoading(user.id);
      const updated = await banUser(user.id);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to ban user");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUnban(user: AdminUserResponse) {
    try {
      setActionLoading(user.id);
      const updated = await unbanUser(user.id);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to unban user");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-10">
            <h1 className="text-5xl font-bold mb-3">Admin Users</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Manage platform users, review their roles, and control access to
              the SafeSpace system.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <aside className="col-span-3">
              <div className="border rounded-xl p-6 sticky top-8">
                <h2 className="font-semibold mb-4">Overview</h2>

                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Total users</p>
                    <p className="text-2xl font-bold mt-1">
                      {stats ? stats.totalUsers : "—"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Admins</p>
                    <p className="text-2xl font-bold mt-1">
                      {stats ? stats.totalAdmins : "—"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Banned users</p>
                    <p className="text-2xl font-bold mt-1">
                      {stats ? stats.totalBanned : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            <section className="col-span-9">
              <div className="flex items-center gap-3 border px-4 py-3 rounded-xl mb-6">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search users by name, email, role, or status"
                  className="w-full outline-none text-sm"
                />
              </div>

              {loading ? (
                <div className="border rounded-xl p-10 text-center text-gray-500 text-sm">
                  Loading users...
                </div>
              ) : error ? (
                <div className="border rounded-xl p-10 text-center">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              ) : (
                <div className="border rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b text-sm font-medium text-gray-600">
                    <div className="col-span-4">User</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-4">Actions</div>
                  </div>

                  {filteredUsers.length === 0 ? (
                    <div className="p-10 text-center">
                      <h3 className="text-xl font-semibold mb-2">No users found</h3>
                      <p className="text-sm text-gray-600">
                        Try searching with different keywords.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="grid grid-cols-12 gap-4 px-6 py-5 items-center"
                        >
                          <div className="col-span-4">
                            <p className="font-medium text-gray-900">{user.nickname}</p>
                            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                          </div>

                          <div className="col-span-2">
                            <span className={`text-xs px-3 py-1 rounded-full ${getRoleBadge(user.role)}`}>
                              {getRoleLabel(user.role)}
                            </span>
                          </div>

                          <div className="col-span-2">
                            <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(user.status)}`}>
                              {getStatusLabel(user.status)}
                            </span>
                          </div>

                          <div className="col-span-4 flex flex-wrap gap-2">
                            <button
                              onClick={() => handleChangeRole(user)}
                              disabled={actionLoading === user.id}
                              className="border px-3 py-2 rounded-md text-sm hover:bg-gray-50 inline-flex items-center gap-2 disabled:opacity-50"
                            >
                              <UserCheck className="w-4 h-4" />
                              {user.role === "ADMIN" ? "Make User" : "Make Admin"}
                            </button>

                            {user.status === "ACTIVE" ? (
                              <button
                                onClick={() => handleBan(user)}
                                disabled={actionLoading === user.id}
                                className="border px-3 py-2 rounded-md text-sm hover:bg-gray-50 inline-flex items-center gap-2 disabled:opacity-50"
                              >
                                <Ban className="w-4 h-4" />
                                Ban
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnban(user)}
                                disabled={actionLoading === user.id}
                                className="border px-3 py-2 rounded-md text-sm hover:bg-gray-50 inline-flex items-center gap-2 disabled:opacity-50"
                              >
                                <ShieldCheck className="w-4 h-4" />
                                Unban
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="border rounded-xl p-6">
                  <Users className="w-6 h-6 text-emerald-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">User control</h3>
                  <p className="text-sm text-gray-600 leading-6">
                    Review users and maintain a safe platform environment.
                  </p>
                </div>

                <div className="border rounded-xl p-6">
                  <Shield className="w-6 h-6 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Role management</h3>
                  <p className="text-sm text-gray-600 leading-6">
                    Assign admin access where needed.
                  </p>
                </div>

                <div className="border rounded-xl p-6">
                  <Ban className="w-6 h-6 text-red-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Access restriction</h3>
                  <p className="text-sm text-gray-600 leading-6">
                    Restrict users who violate safety or community guidelines.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}