package com.mentalhealth.platform.auth.dto;

public class AuthResponse {

    private String token;
    private String email;
    private String nickname;
    private String role;

    public AuthResponse(String token, String email, String nickname, String role) {
        this.token = token;
        this.email = email;
        this.nickname = nickname;
        this.role = role;
    }

    public String getToken() {
        return token;
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