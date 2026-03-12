package com.mentalhealth.platform.auth.dto;

public class UpdateAccountRequest {

    private String nickname;
    private String email;
    private String currentPassword;
    private String newPassword;

    public UpdateAccountRequest() {}

    public String getNickname() { return nickname; }
    public String getEmail() { return email; }
    public String getCurrentPassword() { return currentPassword; }
    public String getNewPassword() { return newPassword; }

    public void setNickname(String nickname) { this.nickname = nickname; }
    public void setEmail(String email) { this.email = email; }
    public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}