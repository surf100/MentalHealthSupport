import { useEffect, useState } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import {
  Settings,
  User,
  Mail,
  Lock,
  Bell,
  ShieldCheck,
  Monitor,
  Globe,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import {
  getSettings,
  updateAccountSettings,
  updatePreferences,
  type SettingsResponse,
} from "../api/settings-api";
import { saveToken } from "../lib/auth-storage";
import { applyThemePreference } from "../lib/theme";

// ─── Types ────────────────────────────────────────────────────────────────────

type AccountSection = "nickname" | "email" | "password";

// ─── Toggle component ─────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 ${
        checked ? "bg-emerald-500" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="border rounded-xl overflow-hidden divide-y">{children}</div>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onClick,
  open,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: () => void;
  open: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors text-left"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">{label}</p>
          <p className="font-medium text-sm">{value}</p>
        </div>
      </div>
      <ChevronRight
        className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${
          open ? "rotate-90" : ""
        }`}
      />
    </button>
  );
}

function SettingsExpandPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t px-6 py-5 bg-gray-50 space-y-4">{children}</div>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
      />
    </div>
  );
}

function ActionButtons({
  onSave,
  onCancel,
  isSaving,
  disabled,
  saveLabel = "Save changes",
}: {
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  disabled?: boolean;
  saveLabel?: string;
}) {
  return (
    <div className="flex gap-3 pt-1">
      <button
        onClick={onSave}
        disabled={isSaving || disabled}
        className="bg-black text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {isSaving ? "Saving..." : saveLabel}
      </button>
      <button
        onClick={onCancel}
        className="border px-5 py-2.5 rounded-md text-sm font-medium hover:bg-white transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Server state
  const [settings, setSettings] = useState<SettingsResponse | null>(null);

  // Account section state
  const [openSection, setOpenSection] = useState<AccountSection | null>(null);
  const [newNickname, setNewNickname] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Preferences (optimistic)
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState(true);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    async function load() {
      try {
        const data = await getSettings();
        setSettings(data);
        setNotifications(data.notificationsEnabled);
        setPrivacy(data.privacyModeEnabled);
        setTheme(data.themePreference);
        setLanguage(data.languagePreference);
        applyThemePreference(data.themePreference);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  function toggleSection(section: AccountSection) {
    clearMessages();
    if (openSection === section) {
      setOpenSection(null);
      return;
    }
    setNewNickname(settings?.nickname ?? "");
    setNewEmail(settings?.email ?? "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOpenSection(section);
  }

  async function handleAccountSave(section: AccountSection) {
    clearMessages();

    if (section === "password") {
      if (!currentPassword) { setError("Current password is required"); return; }
      if (newPassword.length < 6) { setError("New password must be at least 6 characters"); return; }
      if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    }

    if (section === "nickname" && !newNickname.trim()) {
      setError("Nickname cannot be empty");
      return;
    }

    if (section === "email" && !newEmail.trim()) {
      setError("Email cannot be empty");
      return;
    }

    const payload =
      section === "nickname"
        ? { nickname: newNickname.trim() }
        : section === "email"
        ? { email: newEmail.trim() }
        : { currentPassword, newPassword };

    try {
      setIsSaving(true);
      const updated = await updateAccountSettings(payload);
      // If email changed, backend issues a new token — save it
      if (updated.token) {
        saveToken(updated.token);
      }
      setSettings((prev) => prev ? { ...prev, ...updated } : updated);
      setOpenSection(null);
      setSuccess(
        section === "nickname"
          ? "Nickname updated successfully"
          : section === "email"
          ? "Email updated successfully"
          : "Password changed successfully"
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePreferenceChange(patch: Partial<SettingsResponse>) {
    clearMessages();
    const previousSettings = settings;
    // Optimistic update
    setSettings((prev) => prev ? { ...prev, ...patch } : null);
    if (patch.notificationsEnabled !== undefined) setNotifications(patch.notificationsEnabled);
    if (patch.privacyModeEnabled !== undefined) setPrivacy(patch.privacyModeEnabled);
    if (patch.themePreference !== undefined) {
      setTheme(patch.themePreference);
      applyThemePreference(patch.themePreference);
    }
    if (patch.languagePreference !== undefined) setLanguage(patch.languagePreference);

    try {
      await updatePreferences(patch);
      setSuccess("Preferences saved");
      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save preferences");
      // Revert on error
      if (previousSettings) {
        setNotifications(previousSettings.notificationsEnabled);
        setPrivacy(previousSettings.privacyModeEnabled);
        setTheme(previousSettings.themePreference);
        setLanguage(previousSettings.languagePreference);
        setSettings(previousSettings);
        applyThemePreference(previousSettings.themePreference);
      }
    }
  }

  // ── Skeleton ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-8 py-12 space-y-8">
            <div className="h-10 w-48 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-5 w-72 bg-gray-100 rounded animate-pulse" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Page ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-8 py-12">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-6 h-6" />
              <h1 className="text-3xl font-bold">Account Settings</h1>
            </div>
            <p className="text-gray-500 text-sm">
              Manage your account details, security, and preferences.
            </p>
          </div>

          {/* Banners */}
          {success && (
            <div className="mb-6 flex items-center gap-2 border border-green-200 bg-green-50 rounded-xl px-5 py-3.5 text-green-700 text-sm">
              <Check className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 flex items-center gap-2 border border-red-200 bg-red-50 rounded-xl px-5 py-3.5 text-red-700 text-sm">
              <X className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-8">

            {/* ── Section: Account ── */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 px-1">
                Account
              </h2>
              <SettingsCard>
                {/* Nickname */}
                <div>
                  <SettingsRow
                    icon={<User className="w-4 h-4 text-gray-600" />}
                    label="Nickname"
                    value={settings?.nickname ?? ""}
                    onClick={() => toggleSection("nickname")}
                    open={openSection === "nickname"}
                  />
                  {openSection === "nickname" && (
                    <SettingsExpandPanel>
                      <InputField
                        label="New nickname"
                        value={newNickname}
                        onChange={setNewNickname}
                        autoComplete="username"
                      />
                      <ActionButtons
                        onSave={() => handleAccountSave("nickname")}
                        onCancel={() => setOpenSection(null)}
                        isSaving={isSaving}
                        disabled={!newNickname.trim()}
                      />
                    </SettingsExpandPanel>
                  )}
                </div>

                {/* Email */}
                <div>
                  <SettingsRow
                    icon={<Mail className="w-4 h-4 text-gray-600" />}
                    label="Email address"
                    value={settings?.email ?? ""}
                    onClick={() => toggleSection("email")}
                    open={openSection === "email"}
                  />
                  {openSection === "email" && (
                    <SettingsExpandPanel>
                      <InputField
                        label="New email address"
                        type="email"
                        value={newEmail}
                        onChange={setNewEmail}
                        autoComplete="email"
                      />
                      <ActionButtons
                        onSave={() => handleAccountSave("email")}
                        onCancel={() => setOpenSection(null)}
                        isSaving={isSaving}
                        disabled={!newEmail.trim()}
                      />
                    </SettingsExpandPanel>
                  )}
                </div>

                {/* Password */}
                <div>
                  <SettingsRow
                    icon={<Lock className="w-4 h-4 text-gray-600" />}
                    label="Password"
                    value="••••••••••"
                    onClick={() => toggleSection("password")}
                    open={openSection === "password"}
                  />
                  {openSection === "password" && (
                    <SettingsExpandPanel>
                      <InputField
                        label="Current password"
                        type="password"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        autoComplete="current-password"
                      />
                      <InputField
                        label="New password"
                        type="password"
                        value={newPassword}
                        onChange={setNewPassword}
                        autoComplete="new-password"
                      />
                      <InputField
                        label="Confirm new password"
                        type="password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        autoComplete="new-password"
                      />
                      <p className="text-xs text-gray-400">
                        Minimum 6 characters.
                      </p>
                      <ActionButtons
                        onSave={() => handleAccountSave("password")}
                        onCancel={() => setOpenSection(null)}
                        isSaving={isSaving}
                        disabled={!currentPassword || !newPassword || !confirmPassword}
                        saveLabel="Change password"
                      />
                    </SettingsExpandPanel>
                  )}
                </div>
              </SettingsCard>
            </div>

            {/* ── Section: Notifications & Privacy ── */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 px-1">
                Notifications & Privacy
              </h2>
              <SettingsCard>
                {/* Notifications toggle */}
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Notifications</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Receive updates about your reports and forum activity
                      </p>
                    </div>
                  </div>
                  <Toggle
                    checked={notifications}
                    onChange={(v) => handlePreferenceChange({ notificationsEnabled: v })}
                  />
                </div>

                {/* Privacy toggle */}
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Privacy mode</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Hide your profile details from other users
                      </p>
                    </div>
                  </div>
                  <Toggle
                    checked={privacy}
                    onChange={(v) => handlePreferenceChange({ privacyModeEnabled: v })}
                  />
                </div>
              </SettingsCard>
            </div>

            {/* ── Section: Appearance ── */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 px-1">
                Appearance & Language
              </h2>
              <SettingsCard>
                {/* Theme */}
                <div className="px-6 py-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Monitor className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Theme</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Choose your preferred interface style
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {(["light", "dark", "system"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => handlePreferenceChange({ themePreference: t })}
                        className={`flex-1 py-2.5 rounded-lg border text-sm font-medium capitalize transition-all ${
                          theme === t
                            ? "border-black bg-black text-white"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div className="px-6 py-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Language</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Select the language for your interface
                      </p>
                    </div>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => handlePreferenceChange({ languagePreference: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="en">English</option>
                    <option value="ru">Русский</option>
                    <option value="kk">Қазақша</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </SettingsCard>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
