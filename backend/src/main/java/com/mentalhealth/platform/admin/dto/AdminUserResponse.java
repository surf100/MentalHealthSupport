package com.mentalhealth.platform.admin.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.mentalhealth.platform.user.entity.User;
import com.mentalhealth.platform.user.enums.UserRole;
import com.mentalhealth.platform.user.enums.UserStatus;

public class AdminUserResponse {

    private Long id;
    private String nickname;
    private String email;
    private UserRole role;
    private UserStatus status;

    @JsonFormat(pattern = "MMMM d, yyyy", locale = "en")
    private LocalDateTime createdAt;

    public AdminUserResponse() {}

    public static AdminUserResponse from(User user) {
        AdminUserResponse dto = new AdminUserResponse();
        dto.id = user.getId();
        dto.nickname = user.getNickname();
        dto.email = user.getEmail();
        dto.role = user.getRole();
        dto.status = user.getStatus();
        dto.createdAt = user.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public String getNickname() { return nickname; }
    public String getEmail() { return email; }
    public UserRole getRole() { return role; }
    public UserStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}