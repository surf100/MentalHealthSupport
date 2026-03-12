package com.mentalhealth.platform.profile.dto;

import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @Size(max = 100, message = "Display name must be at most 100 characters")
    private String displayName;

    @Size(max = 1000, message = "Bio must be at most 1000 characters")
    private String bio;

    @Size(max = 500, message = "Avatar URL must be at most 500 characters")
    private String avatarUrl;

    private Boolean privacyModeEnabled;
    private Boolean notificationsEnabled;

    @Size(max = 30, message = "Theme preference must be at most 30 characters")
    private String themePreference;

    @Size(max = 30, message = "Language preference must be at most 30 characters")
    private String languagePreference;

    public UpdateProfileRequest() {
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

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public void setPrivacyModeEnabled(Boolean privacyModeEnabled) {
        this.privacyModeEnabled = privacyModeEnabled;
    }

    public void setNotificationsEnabled(Boolean notificationsEnabled) {
        this.notificationsEnabled = notificationsEnabled;
    }

    public void setThemePreference(String themePreference) {
        this.themePreference = themePreference;
    }

    public void setLanguagePreference(String languagePreference) {
        this.languagePreference = languagePreference;
    }
}