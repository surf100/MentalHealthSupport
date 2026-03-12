package com.mentalhealth.platform.auth.dto;

public class AccountSettingsResponse {

    private String email;
    private String nickname;
    private boolean notificationsEnabled;
    private boolean privacyModeEnabled;
    private String themePreference;
    private String languagePreference;
    private String token;

    public AccountSettingsResponse() {}

    public AccountSettingsResponse(String email, String nickname,
                                   boolean notificationsEnabled, boolean privacyModeEnabled,
                                   String themePreference, String languagePreference,
                                   String token) {
        this.email = email;
        this.nickname = nickname;
        this.notificationsEnabled = notificationsEnabled;
        this.privacyModeEnabled = privacyModeEnabled;
        this.themePreference = themePreference;
        this.languagePreference = languagePreference;
        this.token = token;
    }

    public String getEmail() { return email; }
    public String getNickname() { return nickname; }
    public boolean isNotificationsEnabled() { return notificationsEnabled; }
    public boolean isPrivacyModeEnabled() { return privacyModeEnabled; }
    public String getThemePreference() { return themePreference; }
    public String getLanguagePreference() { return languagePreference; }
    public String getToken() { return token; }

    public void setEmail(String email) { this.email = email; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public void setNotificationsEnabled(boolean notificationsEnabled) { this.notificationsEnabled = notificationsEnabled; }
    public void setPrivacyModeEnabled(boolean privacyModeEnabled) { this.privacyModeEnabled = privacyModeEnabled; }
    public void setThemePreference(String themePreference) { this.themePreference = themePreference; }
    public void setLanguagePreference(String languagePreference) { this.languagePreference = languagePreference; }
    public void setToken(String token) { this.token = token; }
}