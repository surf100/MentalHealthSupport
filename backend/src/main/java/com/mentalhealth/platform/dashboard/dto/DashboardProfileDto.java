package com.mentalhealth.platform.dashboard.dto;

import java.time.LocalDateTime;

public class DashboardProfileDto {

    private Long id;
    private String nickname;
    private String email;
    private String avatar;
    private LocalDateTime createdAt;

    public DashboardProfileDto() {
    }

    public DashboardProfileDto(Long id, String nickname, String email, String avatar, LocalDateTime createdAt) {
        this.id = id;
        this.nickname = nickname;
        this.email = email;
        this.avatar = avatar;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getNickname() {
        return nickname;
    }

    public String getEmail() {
        return email;
    }

    public String getAvatar() {
        return avatar;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}