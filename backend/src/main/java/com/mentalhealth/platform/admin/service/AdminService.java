package com.mentalhealth.platform.admin.service;

import java.util.List;

import com.mentalhealth.platform.admin.dto.AdminAnalyticsResponse;
import com.mentalhealth.platform.admin.dto.AdminStatsResponse;
import com.mentalhealth.platform.admin.dto.AdminUserResponse;
import com.mentalhealth.platform.admin.dto.AuditLogResponse;
import com.mentalhealth.platform.admin.dto.ChangeRoleRequest;
import com.mentalhealth.platform.admin.dto.SpecialistResponseRequest;
import com.mentalhealth.platform.forum.dto.ForumModerationQueueItemResponse;
import com.mentalhealth.platform.report.dto.ReportModerationQueueItemResponse;

public interface AdminService {

    List<AdminUserResponse> getAllUsers();

    AdminStatsResponse getStats();

    AdminAnalyticsResponse getAnalytics();

    AdminUserResponse changeRole(String actorEmail, Long targetUserId, ChangeRoleRequest request);

    AdminUserResponse banUser(String actorEmail, Long targetUserId);

    AdminUserResponse unbanUser(String actorEmail, Long targetUserId);

    List<AuditLogResponse> getAuditLog();

    List<ForumModerationQueueItemResponse> getForumModerationPosts();

    List<ReportModerationQueueItemResponse> getReportModerationReports();

    ForumModerationQueueItemResponse reviewFlaggedForumPost(String actorEmail, Long postId);

    ForumModerationQueueItemResponse dismissFlaggedForumPost(String actorEmail, Long postId);

    ForumModerationQueueItemResponse escalateFlaggedForumPost(String actorEmail, Long postId);

    ReportModerationQueueItemResponse reviewFlaggedReport(String actorEmail, Long reportId);

    ReportModerationQueueItemResponse dismissFlaggedReport(String actorEmail, Long reportId);

    ReportModerationQueueItemResponse escalateFlaggedReport(String actorEmail, Long reportId);

    ReportModerationQueueItemResponse revealAnonymousReportIdentity(String actorEmail, Long reportId);

    ReportModerationQueueItemResponse addSpecialistResponse(
            String actorEmail,
            Long reportId,
            SpecialistResponseRequest request
    );
    ForumModerationQueueItemResponse addForumSpecialistNote(
        String actorEmail,
        Long postId,
        SpecialistResponseRequest request
);
}
