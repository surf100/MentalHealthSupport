package com.mentalhealth.platform.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mentalhealth.platform.admin.dto.AdminAnalyticsResponse;
import com.mentalhealth.platform.admin.dto.AdminStatsResponse;
import com.mentalhealth.platform.admin.dto.AdminUserResponse;
import com.mentalhealth.platform.admin.dto.AuditLogResponse;
import com.mentalhealth.platform.admin.dto.ChangeRoleRequest;
import com.mentalhealth.platform.admin.dto.SpecialistResponseRequest;
import com.mentalhealth.platform.admin.service.AdminService;
import com.mentalhealth.platform.forum.dto.ForumModerationQueueItemResponse;
import com.mentalhealth.platform.report.dto.ReportModerationQueueItemResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminAnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserResponse> changeRole(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ChangeRoleRequest request
    ) {
        return ResponseEntity.ok(adminService.changeRole(authentication.getName(), id, request));
    }

    @PutMapping("/users/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserResponse> banUser(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(adminService.banUser(authentication.getName(), id));
    }

    @PutMapping("/users/{id}/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserResponse> unbanUser(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(adminService.unbanUser(authentication.getName(), id));
    }

    @GetMapping("/audit-log")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLogResponse>> getAuditLog() {
        return ResponseEntity.ok(adminService.getAuditLog());
    }

    @GetMapping("/forum-risk/posts")
    @PreAuthorize("hasAnyRole('ADMIN', 'SPECIALIST')")
    public ResponseEntity<List<ForumModerationQueueItemResponse>> getForumModerationPosts() {
        return ResponseEntity.ok(adminService.getForumModerationPosts());
    }

    @GetMapping("/report-risk/reports")
    @PreAuthorize("hasAnyRole('ADMIN', 'SPECIALIST')")
    public ResponseEntity<List<ReportModerationQueueItemResponse>> getReportModerationReports() {
        return ResponseEntity.ok(adminService.getReportModerationReports());
    }

    @PutMapping("/forum-risk/posts/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ForumModerationQueueItemResponse> reviewFlaggedForumPost(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(adminService.reviewFlaggedForumPost(authentication.getName(), id));
    }

    @PutMapping("/forum-risk/posts/{id}/dismiss")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ForumModerationQueueItemResponse> dismissFlaggedForumPost(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(adminService.dismissFlaggedForumPost(authentication.getName(), id));
    }

    @PutMapping("/forum-risk/posts/{id}/escalate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ForumModerationQueueItemResponse> escalateFlaggedForumPost(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(adminService.escalateFlaggedForumPost(authentication.getName(), id));
    }

    @PutMapping("/report-risk/reports/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportModerationQueueItemResponse> reviewFlaggedReport(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(adminService.reviewFlaggedReport(authentication.getName(), id));
    }

    @PutMapping("/report-risk/reports/{id}/dismiss")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportModerationQueueItemResponse> dismissFlaggedReport(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(adminService.dismissFlaggedReport(authentication.getName(), id));
    }

    @PutMapping("/report-risk/reports/{id}/escalate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportModerationQueueItemResponse> escalateFlaggedReport(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(adminService.escalateFlaggedReport(authentication.getName(), id));
    }

    @PutMapping("/report-risk/reports/{id}/respond")
    @PreAuthorize("hasAnyRole('ADMIN', 'SPECIALIST')")
    public ResponseEntity<ReportModerationQueueItemResponse> addSpecialistResponse(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody SpecialistResponseRequest request
    ) {
        return ResponseEntity.ok(adminService.addSpecialistResponse(authentication.getName(), id, request));
    }
}
