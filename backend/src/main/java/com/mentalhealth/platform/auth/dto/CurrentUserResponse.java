package com.mentalhealth.platform.auth.dto;

public class CurrentUserResponse {

    private String email;
    private String nickname;
    private String role;

    public CurrentUserResponse(String email, String nickname, String role) {
        this.email = email;
        this.nickname = nickname;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public String getNickname() {
        return nickname;
    }

    public String getRole() {
        return role;
    }
}