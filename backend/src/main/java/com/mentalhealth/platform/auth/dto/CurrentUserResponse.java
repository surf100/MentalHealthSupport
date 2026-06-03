package com.mentalhealth.platform.auth.dto;

public class CurrentUserResponse {

    private String email;
    private String nickname;
    private String displayName;
    private String role;
    private String avatarUrl;

    public CurrentUserResponse(String email, String nickname, String displayName, String avatarUrl, String role) {
    this.email = email;
    this.nickname = nickname;
    this.displayName = displayName;
    this.avatarUrl = avatarUrl;
    this.role = role;
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

    public String getRole() {
        return role;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }
    
}
