package com.mentalhealth.platform.admin.service;

import java.util.List;

import com.mentalhealth.platform.admin.dto.AdminAnalyticsResponse;
import com.mentalhealth.platform.admin.dto.AdminStatsResponse;
import com.mentalhealth.platform.admin.dto.AdminUserResponse;
import com.mentalhealth.platform.admin.dto.AuditLogResponse;
import com.mentalhealth.platform.admin.dto.ChangeRoleRequest;

public interface AdminService {

    List<AdminUserResponse> getAllUsers();

    AdminStatsResponse getStats();

    AdminAnalyticsResponse getAnalytics();

    AdminUserResponse changeRole(String actorEmail, Long targetUserId, ChangeRoleRequest request);

    AdminUserResponse banUser(String actorEmail, Long targetUserId);

    AdminUserResponse unbanUser(String actorEmail, Long targetUserId);

    List<AuditLogResponse> getAuditLog();
}