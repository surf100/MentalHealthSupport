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

// ─── Toggle ───────────────────────────────────────────────────────────────────

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
      style={{
        position: "relative",
        display: "inline-flex",
        height: "24px",
        width: "44px",
        alignItems: "center",
        borderRadius: "99px",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color 0.2s",
        backgroundColor: checked ? "#274C77" : "rgba(39,76,119,0.18)",
        opacity: disabled ? 0.5 : 1,
        flexShrink: 0,
        outline: "none",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: "#FFFFFF",
          boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
          transition: "transform 0.2s",
          transform: checked ? "translateX(22px)" : "translateX(4px)",
        }}
      />
    </button>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "DM Sans, sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.20em",
        textTransform: "uppercase",
        color: "rgba(39,76,119,0.40)",
        marginBottom: "12px",
        paddingLeft: "4px",
      }}
    >
      {children}
    </p>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(39,76,119,0.10)",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(39,76,119,0.06)",
      }}
    >
      {children}
    </div>
  );
}

function CardDivider() {
  return (
    <div style={{ height: "1px", background: "rgba(39,76,119,0.08)", margin: "0" }} />
  );
}

function IconBox({
  children,
  tint = "ice",
}: {
  children: React.ReactNode;
  tint?: "ice" | "calm" | "muted";
}) {
  const bg =
    tint === "ice"
      ? "rgba(163,206,241,0.30)"
      : tint === "calm"
      ? "rgba(96,150,186,0.18)"
      : "rgba(39,76,119,0.08)";

  return (
    <div
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "10px",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onClick,
  open,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: () => void;
  open: boolean;
  tint?: "ice" | "calm" | "muted";
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 24px",
        background: hovered ? "rgba(163,206,241,0.08)" : "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <IconBox tint={tint}>{icon}</IconBox>
        <div>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              color: "rgba(39,76,119,0.45)",
              margin: "0 0 3px",
              letterSpacing: "0.04em",
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#274C77",
              margin: 0,
            }}
          >
            {value}
          </p>
        </div>
      </div>
      <ChevronRight
        className="w-4 h-4 shrink-0"
        style={{
          color: "rgba(39,76,119,0.30)",
          transition: "transform 0.2s",
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
        }}
      />
    </button>
  );
}

function SettingsExpandPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "20px 24px",
        background: "#F8FBFD",
        borderTop: "1px solid rgba(39,76,119,0.07)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {children}
    </div>
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
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "DM Sans, sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          color: "#274C77",
          marginBottom: "8px",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "10px 14px",
          fontFamily: "DM Sans, sans-serif",
          fontSize: "14px",
          color: "#274C77",
          background: "#FFFFFF",
          border: `1px solid ${focused ? "rgba(96,150,186,0.65)" : "rgba(39,76,119,0.15)"}`,
          borderRadius: "10px",
          outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(96,150,186,0.12)" : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxSizing: "border-box",
        }}
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
  const [saveHovered, setSaveHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);
  const isDisabled = isSaving || disabled;

  return (
    <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
      <button
        onClick={onSave}
        disabled={isDisabled}
        onMouseEnter={() => setSaveHovered(true)}
        onMouseLeave={() => setSaveHovered(false)}
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          color: "#E7ECEF",
          background: isDisabled ? "rgba(39,76,119,0.25)" : saveHovered ? "#6096BA" : "#274C77",
          border: "none",
          borderRadius: "8px",
          padding: "9px 20px",
          cursor: isDisabled ? "not-allowed" : "pointer",
          transition: "background 0.18s",
        }}
      >
        {isSaving ? "Saving…" : saveLabel}
      </button>
      <button
        onClick={onCancel}
        onMouseEnter={() => setCancelHovered(true)}
        onMouseLeave={() => setCancelHovered(false)}
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          color: "#274C77",
          background: cancelHovered ? "rgba(163,206,241,0.20)" : "transparent",
          border: "1px solid rgba(39,76,119,0.15)",
          borderRadius: "8px",
          padding: "9px 20px",
          cursor: "pointer",
          transition: "background 0.15s, border-color 0.15s",
        }}
      >
        Cancel
      </button>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#E7ECEF" }}
    >
      <Header />

      {/* Skeleton hero */}
      <div style={{ backgroundColor: "#A3CEF1", borderBottom: "1px solid rgba(39,76,119,0.13)", padding: "52px 56px 48px" }}>
        <div className="animate-pulse" style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{ height: "12px", width: "80px", background: "rgba(39,76,119,0.15)", borderRadius: "6px", marginBottom: "20px" }} />
          <div style={{ height: "40px", width: "280px", background: "rgba(39,76,119,0.15)", borderRadius: "8px", marginBottom: "14px" }} />
          <div style={{ height: "16px", width: "360px", background: "rgba(39,76,119,0.10)", borderRadius: "6px" }} />
        </div>
      </div>

      <main style={{ flex: 1, padding: "40px 56px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(39,76,119,0.09)",
                borderRadius: "18px",
                overflow: "hidden",
              }}
            >
              {[1, 2].map((j) => (
                <div key={j}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 24px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(39,76,119,0.07)", flexShrink: 0 }} />
                    <div>
                      <div style={{ height: "10px", width: "60px", background: "rgba(39,76,119,0.07)", borderRadius: "4px", marginBottom: "8px" }} />
                      <div style={{ height: "14px", width: "140px", background: "rgba(39,76,119,0.07)", borderRadius: "4px" }} />
                    </div>
                  </div>
                  {j < 2 && <div style={{ height: "1px", background: "rgba(39,76,119,0.07)" }} />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function SettingsPage() {
  // ── All state — preserved exactly ─────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [settings, setSettings] = useState<SettingsResponse | null>(null);

  const [openSection, setOpenSection] = useState<AccountSection | null>(null);
  const [newNickname, setNewNickname] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState(true);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  // ── All handlers — preserved exactly ──────────────────────────────────────

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
    if (section === "nickname" && !newNickname.trim()) { setError("Nickname cannot be empty"); return; }
    if (section === "email" && !newEmail.trim()) { setError("Email cannot be empty"); return; }

    const payload =
      section === "nickname"
        ? { nickname: newNickname.trim() }
        : section === "email"
        ? { email: newEmail.trim() }
        : { currentPassword, newPassword };

    try {
      setIsSaving(true);
      const updated = await updateAccountSettings(payload);
      if (updated.token) saveToken(updated.token);
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

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) return <SkeletonPage />;

  // ── Page ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#E7ECEF", fontFamily: "DM Sans, sans-serif", color: "#274C77" }}
    >
      <Header />

      {/* ── Hero strip ────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "#A3CEF1",
          borderBottom: "1px solid rgba(39,76,119,0.13)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.12,
            backgroundImage: "radial-gradient(#274C77 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "920px",
            margin: "0 auto",
            padding: "44px 56px 40px",
          }}
        >
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(39,76,119,0.55)",
              marginBottom: "14px",
            }}
          >
            Your account
          </p>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(39,76,119,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "4px",
              }}
            >
              <Settings className="w-5 h-5" style={{ color: "#274C77" }} />
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  color: "#274C77",
                  margin: "0 0 10px",
                }}
              >
                Account Settings
              </h1>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.70,
                  letterSpacing: "-0.01em",
                  color: "rgba(39,76,119,0.62)",
                  margin: 0,
                }}
              >
                Manage your account details, security, and preferences.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main style={{ flex: 1 }}>
        <div
          style={{
            maxWidth: "920px",
            margin: "0 auto",
            padding: "36px 56px 72px",
          }}
        >

          {/* ── Banners ─────────────────────────────────────────────────── */}
          {success && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(163,206,241,0.22)",
                border: "1px solid rgba(96,150,186,0.30)",
                borderRadius: "12px",
                padding: "13px 18px",
                marginBottom: "24px",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "#274C77",
              }}
            >
              <Check className="w-4 h-4 shrink-0" style={{ color: "#274C77" }} />
              {success}
            </div>
          )}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(192,57,43,0.06)",
                border: "1px solid rgba(192,57,43,0.22)",
                borderRadius: "12px",
                padding: "13px 18px",
                marginBottom: "24px",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(192,57,43,0.90)",
              }}
            >
              <X className="w-4 h-4 shrink-0" style={{ color: "rgba(192,57,43,0.85)" }} />
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* ── Account ─────────────────────────────────────────────────── */}
            <div>
              <SectionLabel>Account</SectionLabel>
              <SettingsCard>
                {/* Nickname */}
                <div>
                  <SettingsRow
                    icon={<User className="w-4 h-4" style={{ color: "#274C77" }} />}
                    label="Nickname"
                    value={settings?.nickname ?? ""}
                    onClick={() => toggleSection("nickname")}
                    open={openSection === "nickname"}
                    tint="ice"
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

                <CardDivider />

                {/* Email */}
                <div>
                  <SettingsRow
                    icon={<Mail className="w-4 h-4" style={{ color: "#274C77" }} />}
                    label="Email address"
                    value={settings?.email ?? ""}
                    onClick={() => toggleSection("email")}
                    open={openSection === "email"}
                    tint="calm"
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

                <CardDivider />

                {/* Password */}
                <div>
                  <SettingsRow
                    icon={<Lock className="w-4 h-4" style={{ color: "#274C77" }} />}
                    label="Password"
                    value="••••••••••"
                    onClick={() => toggleSection("password")}
                    open={openSection === "password"}
                    tint="muted"
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
                      <p
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "12px",
                          color: "rgba(39,76,119,0.42)",
                          margin: 0,
                        }}
                      >
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

            {/* ── Notifications & Privacy ────────────────────────────────── */}
            <div>
              <SectionLabel>Notifications &amp; Privacy</SectionLabel>
              <SettingsCard>
                {/* Notifications toggle */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 24px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <IconBox tint="ice">
                      <Bell className="w-4 h-4" style={{ color: "#274C77" }} />
                    </IconBox>
                    <div>
                      <p
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#274C77",
                          margin: "0 0 3px",
                        }}
                      >
                        Notifications
                      </p>
                      <p
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "12px",
                          color: "rgba(39,76,119,0.50)",
                          margin: 0,
                        }}
                      >
                        Receive updates about your reports and forum activity
                      </p>
                    </div>
                  </div>
                  <Toggle
                    checked={notifications}
                    onChange={(v) => handlePreferenceChange({ notificationsEnabled: v })}
                  />
                </div>

                <CardDivider />

                {/* Privacy toggle */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 24px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <IconBox tint="calm">
                      <ShieldCheck className="w-4 h-4" style={{ color: "#274C77" }} />
                    </IconBox>
                    <div>
                      <p
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#274C77",
                          margin: "0 0 3px",
                        }}
                      >
                        Privacy mode
                      </p>
                      <p
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "12px",
                          color: "rgba(39,76,119,0.50)",
                          margin: 0,
                        }}
                      >
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

            

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ─── Theme button with hover state ────────────────────────────────────────────

function ThemeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        fontFamily: "DM Sans, sans-serif",
        fontSize: "13px",
        fontWeight: 600,
        textTransform: "capitalize",
        padding: "10px 0",
        borderRadius: "10px",
        border: `1px solid ${active ? "transparent" : hovered ? "rgba(39,76,119,0.25)" : "rgba(39,76,119,0.12)"}`,
        cursor: "pointer",
        transition: "all 0.15s",
        backgroundColor: active ? "#274C77" : hovered ? "rgba(163,206,241,0.20)" : "transparent",
        color: active ? "#E7ECEF" : "#274C77",
      }}
    >
      {label}
    </button>
  );
}

// ─── Language select with focus ring ─────────────────────────────────────────

function LanguageSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        padding: "10px 14px",
        fontFamily: "DM Sans, sans-serif",
        fontSize: "14px",
        color: "#274C77",
        background: "#F8FBFD",
        border: `1px solid ${focused ? "rgba(96,150,186,0.65)" : "rgba(39,76,119,0.15)"}`,
        borderRadius: "10px",
        outline: "none",
        boxShadow: focused ? "0 0 0 3px rgba(96,150,186,0.12)" : "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
        cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23274C77' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
        paddingRight: "36px",
        boxSizing: "border-box",
      }}
    >
      <option value="en">English</option>
      <option value="ru">Русский</option>
      <option value="kk">Қазақша</option>
      <option value="de">Deutsch</option>
      <option value="fr">Français</option>
      <option value="es">Español</option>
    </select>
  );
}