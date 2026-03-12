package com.mentalhealth.platform.profile.dto;

import java.time.LocalDateTime;

public class ProfileResponse {

    private String email;
    private String nickname;
    private String displayName;
    private String bio;
    private String avatarUrl;
    private Boolean privacyModeEnabled;
    private Boolean notificationsEnabled;
    private String themePreference;
    private String languagePreference;
    private LocalDateTime memberSince;

    public ProfileResponse(
            String email,
            String nickname,
            String displayName,
            String bio,
            String avatarUrl,
            Boolean privacyModeEnabled,
            Boolean notificationsEnabled,
            String themePreference,
            String languagePreference,
            LocalDateTime memberSince
    ) {
        this.email = email;
        this.nickname = nickname;
        this.displayName = displayName;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.privacyModeEnabled = privacyModeEnabled;
        this.notificationsEnabled = notificationsEnabled;
        this.themePreference = themePreference;
        this.languagePreference = languagePreference;
        this.memberSince = memberSince;
    }

    public String getEmail() {
        return email;
    }

    public String getNickname() {
        return nickname;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getBio() {
        return bio;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public Boolean getPrivacyModeEnabled() {
        return privacyModeEnabled;
    }

    public Boolean getNotificationsEnabled() {
        return notificationsEnabled;
    }

    public String getThemePreference() {
        return themePreference;
    }

    public String getLanguagePreference() {
        return languagePreference;
    }

    public LocalDateTime getMemberSince() {
        return memberSince;
    }
}