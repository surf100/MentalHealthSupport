import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { AlertCircle, Ban, Search, Shield, ShieldCheck, UserCheck, Users } from "lucide-react";
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
import { useAuth } from "../auth/auth-context";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getRoleBadge(role: AdminUserRole): { bg: string; color: string } {
  switch (role) {
    case "ADMIN":
      return { bg: "rgba(36,76,90,0.13)", color: "#274C77" };
    case "SPECIALIST":
      return { bg: "rgba(136,187,214,0.28)", color: "#274C77" };
    case "USER":
      return { bg: "rgba(153,211,223,0.40)", color: "#274C77" };
    default:
      return { bg: "rgba(205,205,205,0.50)", color: "#274C77" };
  }
}

function getRoleLabel(role: AdminUserRole): string {
  switch (role) {
    case "ADMIN":      return "Admin";
    case "SPECIALIST": return "Specialist";
    case "USER":       return "User";
    default:           return role;
  }
}

function getStatusBadge(status: AdminUserStatus): { bg: string; color: string } {
  switch (status) {
    case "ACTIVE":    return { bg: "rgba(136,187,214,0.22)", color: "#274C77" };
    case "BANNED":    return { bg: "rgba(36,76,90,0.12)", color: "#274C77" };
    case "SUSPENDED": return { bg: "rgba(205,205,205,0.60)", color: "#274C77" };
    default:          return { bg: "rgba(205,205,205,0.40)", color: "#274C77" };
  }
}

function getStatusLabel(status: AdminUserStatus): string {
  switch (status) {
    case "ACTIVE":    return "Active";
    case "BANNED":    return "Banned";
    case "SUSPENDED": return "Suspended";
    default:          return status;
  }
}

function getInitials(nickname: string): string {
  return nickname.slice(0, 2).toUpperCase();
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div
      className="grid grid-cols-12 gap-4 px-6 py-5 items-center border-b last:border-0"
      style={{ borderColor: "rgba(36,76,90,0.07)" }}
    >
      <div className="col-span-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: "rgba(153,211,223,0.35)" }} />
        <div className="space-y-2">
          <div className="h-3 w-24 rounded animate-pulse" style={{ backgroundColor: "rgba(36,76,90,0.08)" }} />
          <div className="h-2.5 w-32 rounded animate-pulse" style={{ backgroundColor: "rgba(36,76,90,0.05)" }} />
        </div>
      </div>
      <div className="col-span-2">
        <div className="h-6 w-16 rounded-full animate-pulse" style={{ backgroundColor: "rgba(153,211,223,0.25)" }} />
      </div>
      <div className="col-span-2">
        <div className="h-6 w-14 rounded-full animate-pulse" style={{ backgroundColor: "rgba(136,187,214,0.18)" }} />
      </div>
      <div className="col-span-4 flex gap-2">
        <div className="h-8 w-24 rounded animate-pulse" style={{ backgroundColor: "rgba(36,76,90,0.06)" }} />
        <div className="h-8 w-24 rounded animate-pulse" style={{ backgroundColor: "rgba(36,76,90,0.06)" }} />
        <div className="h-8 w-16 rounded animate-pulse" style={{ backgroundColor: "rgba(36,76,90,0.06)" }} />
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [roleDrafts, setRoleDrafts] = useState<Record<number, AdminUserRole>>({});

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
    const newRole = roleDrafts[user.id] ?? user.role;
    if (newRole === user.role) return;
    try {
      setActionLoading(user.id);
      const updated = await changeUserRole(user.id, newRole);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setRoleDrafts((prev) => ({ ...prev, [user.id]: updated.role }));
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
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: "#F9F7F3", color: "#274C77" }}
    >
      <Header />

      {/* ── Hero strip ─────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden border-b"
        style={{ backgroundColor: "#A3CEF1", borderColor: "rgba(36,76,90,0.12)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: "radial-gradient(#274C77 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-12">
          <p
            className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] mb-3"
            style={{ color: "rgba(36,76,90,0.60)" }}
          >
            Admin · Users
          </p>
          <h1
            className="font-display text-[40px] sm:text-[52px] leading-[1.05] tracking-[-0.04em]"
            style={{ color: "#274C77" }}
          >
            User Management
          </h1>
          <p
            className="mt-3 font-sans text-[16px] leading-[1.75] tracking-[-0.01em] max-w-2xl"
            style={{ color: "rgba(36,76,90,0.65)" }}
          >
            Manage platform users, review their roles, and control access to the SafeSpace system.
          </p>
        </div>
      </div>

      {/* ── Main layout ────────────────────────────────────────────────────── */}
      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-10">
          <div className="grid grid-cols-12 gap-8 items-start">

            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <aside className="col-span-12 lg:col-span-3">
              <div
                className="rounded-2xl p-6 sticky top-24 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.18)",
                  boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                }}
              >
                <p
                  className="font-sans text-[11px] font-bold uppercase tracking-[0.20em] mb-5"
                  style={{ color: "#6096BA" }}
                >
                  Overview
                </p>

                <div className="space-y-3">
                  {[
                    { label: "Total users",   value: stats?.totalUsers },
                    { label: "Admins",        value: stats?.totalAdmins },
                    { label: "Banned users",  value: stats?.totalBanned },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl p-4 border"
                      style={{ backgroundColor: "#F9F7F3", borderColor: "rgba(36,76,90,0.07)" }}
                    >
                      <p className="font-sans text-[12px] tracking-[-0.01em]" style={{ color: "rgba(36,76,90,0.55)" }}>
                        {label}
                      </p>
                      <p className="font-display text-[32px] leading-none mt-1 tracking-[-0.03em]" style={{ color: "#274C77" }}>
                        {loading || value === undefined
                          ? <span className="inline-block h-8 w-10 rounded animate-pulse" style={{ backgroundColor: "rgba(36,76,90,0.08)" }} />
                          : value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t" style={{ borderColor: "rgba(36,76,90,0.08)" }}>
                  <div className="space-y-3">
                    {[
                      { icon: Users,  label: "User control",       desc: "Safe platform environment" },
                      { icon: Shield, label: "Role management",     desc: "Admin & specialist access" },
                      { icon: Ban,    label: "Access restriction",  desc: "Enforce community guidelines" },
                    ].map(({ icon: Icon, label, desc }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div
                          className="mt-0.5 rounded-lg p-2 flex-shrink-0"
                          style={{ backgroundColor: "rgba(153,211,223,0.35)" }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: "#274C77" }} />
                        </div>
                        <div>
                          <p className="font-sans text-[13px] font-semibold leading-tight" style={{ color: "#274C77" }}>
                            {label}
                          </p>
                          <p className="font-sans text-[12px] mt-0.5 leading-[1.5]" style={{ color: "rgba(36,76,90,0.55)" }}>
                            {desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* ── Table section ────────────────────────────────────────────── */}
            <section className="col-span-12 lg:col-span-9">

              {/* Search bar */}
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5 border"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(136,187,214,0.25)",
                  boxShadow: "0 2px 12px rgba(36,76,90,0.06)",
                }}
              >
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(36,76,90,0.40)" }} />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, email, role, or status…"
                  className="w-full outline-none bg-transparent font-sans text-[14px] tracking-[-0.01em] placeholder:opacity-40"
                  style={{ color: "#274C77" }}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="font-sans text-[12px] px-2 py-0.5 rounded"
                    style={{ color: "rgba(36,76,90,0.50)" }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Table card */}
              {loading ? (
                <div
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "rgba(136,187,214,0.18)",
                    boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                  }}
                >
                  <div
                    className="grid grid-cols-12 gap-4 px-6 py-4 border-b"
                    style={{ backgroundColor: "rgba(153,211,223,0.15)", borderColor: "rgba(36,76,90,0.08)" }}
                  >
                    {[
                      { label: "User",    span: "col-span-4" },
                      { label: "Role",    span: "col-span-2" },
                      { label: "Status",  span: "col-span-2" },
                      { label: "Actions", span: "col-span-4" },
                    ].map(({ label, span }) => (
                      <div
                        key={label}
                        className={`font-sans text-[11px] font-bold uppercase tracking-[0.14em] ${span}`}
                        style={{ color: "rgba(36,76,90,0.50)" }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                  {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
                </div>
              ) : error ? (
                <div
                  className="rounded-2xl border p-16 flex flex-col items-center text-center"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "rgba(136,187,214,0.18)",
                    boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                  }}
                >
                  <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: "rgba(36,76,90,0.06)" }}>
                    <AlertCircle className="w-7 h-7" style={{ color: "#274C77" }} />
                  </div>
                  <h3 className="font-display text-[22px] tracking-[-0.03em] mb-2" style={{ color: "#274C77" }}>
                    Failed to load users
                  </h3>
                  <p className="font-sans text-[14px] leading-[1.75] mb-6 max-w-xs" style={{ color: "rgba(36,76,90,0.60)" }}>
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="font-sans text-[14px] font-semibold px-5 py-2.5 rounded-sm transition"
                    style={{ backgroundColor: "#6096BA", color: "#FFFFFF" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#274C77")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6096BA")}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "rgba(136,187,214,0.18)",
                    boxShadow: "0 8px 40px rgba(36,76,90,0.08)",
                  }}
                >
                  {/* Table header */}
                  <div
                    className="grid grid-cols-12 gap-4 px-6 py-4 border-b"
                    style={{ backgroundColor: "rgba(153,211,223,0.15)", borderColor: "rgba(36,76,90,0.08)" }}
                  >
                    {[
                      { label: "User",    span: "col-span-4" },
                      { label: "Role",    span: "col-span-2" },
                      { label: "Status",  span: "col-span-2" },
                      { label: "Actions", span: "col-span-4" },
                    ].map(({ label, span }) => (
                      <div
                        key={label}
                        className={`font-sans text-[11px] font-bold uppercase tracking-[0.14em] ${span}`}
                        style={{ color: "rgba(36,76,90,0.50)" }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>

                  {filteredUsers.length === 0 ? (
                    <div className="py-20 flex flex-col items-center text-center">
                      <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: "rgba(153,211,223,0.20)" }}>
                        <Users className="w-7 h-7" style={{ color: "rgba(36,76,90,0.40)" }} />
                      </div>
                      <h3 className="font-display text-[22px] tracking-[-0.03em] mb-2" style={{ color: "#274C77" }}>
                        No users found
                      </h3>
                      <p className="font-sans text-[14px] leading-[1.75] max-w-xs" style={{ color: "rgba(36,76,90,0.55)" }}>
                        No users match your search. Try different keywords.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {filteredUsers.map((user, idx) => {
                        const isSelf = currentUser?.email === user.email;
                        const isActing = actionLoading === user.id;
                        const currentDraftRole = roleDrafts[user.id] ?? user.role;
                        const roleUnchanged = currentDraftRole === user.role;
                        const roleBadge = getRoleBadge(user.role);
                        const statusBadge = getStatusBadge(user.status);

                        return (
                          <div
                            key={user.id}
                            className="grid grid-cols-12 gap-4 px-6 py-5 items-center transition-colors"
                            style={{
                              borderBottom: idx < filteredUsers.length - 1 ? "1px solid rgba(36,76,90,0.07)" : "none",
                              opacity: isActing ? 0.6 : 1,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(153,211,223,0.06)")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            {/*
                              The backend also blocks self-role and self-ban changes.
                              This keeps the UI aligned with that rule.
                            */}

                            {/* User */}
                            <div className="col-span-4 flex items-center gap-3">
                              <div
                                className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 font-sans text-[11px] font-bold"
                                style={{
                                  backgroundColor: isSelf ? "rgba(136,187,214,0.30)" : "rgba(153,211,223,0.30)",
                                  color: "#274C77",
                                }}
                              >
                                {getInitials(user.nickname)}
                              </div>
                              <div>
                                <p className="font-sans text-[13px] font-semibold leading-snug tracking-[-0.01em]" style={{ color: "#274C77" }}>
                                  {user.nickname}
                                  {isSelf && (
                                    <span className="ml-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "#6096BA" }}>
                                      You
                                    </span>
                                  )}
                                </p>
                                <p className="font-sans text-[12px] mt-0.5 tracking-[-0.01em]" style={{ color: "rgba(36,76,90,0.50)" }}>
                                  {user.email}
                                </p>
                              </div>
                            </div>

                            {/* Role badge */}
                            <div className="col-span-2">
                              <span
                                className="inline-block font-sans text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full"
                                style={{ backgroundColor: roleBadge.bg, color: roleBadge.color }}
                              >
                                {getRoleLabel(user.role)}
                              </span>
                            </div>

                            {/* Status badge */}
                            <div className="col-span-2">
                              <span
                                className="inline-block font-sans text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full"
                                style={{ backgroundColor: statusBadge.bg, color: statusBadge.color }}
                              >
                                {getStatusLabel(user.status)}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="col-span-4 flex flex-wrap gap-2 items-center">
                              <select
                                value={currentDraftRole}
                                onChange={(e) =>
                                  setRoleDrafts((prev) => ({
                                    ...prev,
                                    [user.id]: e.target.value as AdminUserRole,
                                  }))
                                }
                                disabled={isActing || isSelf}
                                className="font-sans text-[13px] tracking-[-0.01em] px-3 py-1.5 rounded-lg border outline-none transition disabled:opacity-40"
                                style={{
                                  backgroundColor: "#F6F8F9",
                                  borderColor: "rgba(36,76,90,0.15)",
                                  color: "#274C77",
                                }}
                              >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SPECIALIST">Specialist</option>
                              </select>

                              <button
                                onClick={() => handleChangeRole(user)}
                                disabled={isActing || isSelf || roleUnchanged}
                                className="font-sans text-[12px] font-semibold px-3 py-1.5 rounded-lg border inline-flex items-center gap-1.5 transition disabled:opacity-40"
                                style={{
                                  borderColor: "rgba(36,76,90,0.18)",
                                  color: "#274C77",
                                  backgroundColor: "transparent",
                                }}
                                onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "rgba(136,187,214,0.15)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                Apply
                              </button>

                              {user.status === "ACTIVE" ? (
                                <button
                                  onClick={() => handleBan(user)}
                                  disabled={isActing || isSelf}
                                  className="font-sans text-[12px] font-semibold px-3 py-1.5 rounded-lg border inline-flex items-center gap-1.5 transition disabled:opacity-40"
                                  style={{
                                    borderColor: "rgba(36,76,90,0.18)",
                                    color: "#274C77",
                                    backgroundColor: "transparent",
                                  }}
                                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "rgba(36,76,90,0.07)"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  Ban
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUnban(user)}
                                  disabled={isActing}
                                  className="font-sans text-[12px] font-semibold px-3 py-1.5 rounded-lg border inline-flex items-center gap-1.5 transition disabled:opacity-40"
                                  style={{
                                    borderColor: "rgba(136,187,214,0.35)",
                                    color: "#274C77",
                                    backgroundColor: "rgba(136,187,214,0.10)",
                                  }}
                                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "rgba(136,187,214,0.22)"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(136,187,214,0.10)"; }}
                                >
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Unban
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Entry count note */}
              {!loading && !error && filteredUsers.length > 0 && (
                <p
                  className="mt-4 font-sans text-[12px] tracking-[-0.01em]"
                  style={{ color: "rgba(36,76,90,0.45)" }}
                >
                  Showing {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}
                  {query ? ` matching "${query}"` : ""}
                </p>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}