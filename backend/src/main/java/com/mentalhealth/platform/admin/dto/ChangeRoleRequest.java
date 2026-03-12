package com.mentalhealth.platform.admin.dto;

import com.mentalhealth.platform.user.enums.UserRole;

import jakarta.validation.constraints.NotNull;

public class ChangeRoleRequest {

    @NotNull(message = "Role is required")
    private UserRole role;

    public ChangeRoleRequest() {}

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
}