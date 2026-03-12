package com.mentalhealth.platform.admin.service;

import com.mentalhealth.platform.admin.dto.*;
import com.mentalhealth.platform.admin.entity.AuditAction;
import com.mentalhealth.platform.admin.entity.AuditLog;
import com.mentalhealth.platform.admin.repository.AuditLogRepository;
import com.mentalhealth.platform.common.exception.BadRequestException;
import com.mentalhealth.platform.forum.repository.ForumPostRepository;
import com.mentalhealth.platform.report.entity.Report;
import com.mentalhealth.platform.report.entity.ReportCategory;
import com.mentalhealth.platform.report.entity.ReportStatus;
import com.mentalhealth.platform.report.repository.ReportRepository;
import com.mentalhealth.platform.user.entity.User;
import com.mentalhealth.platform.user.enums.UserStatus;
import com.mentalhealth.platform.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final ReportRepository reportRepository;
    private final ForumPostRepository forumPostRepository;

    private static final DateTimeFormatter DAY_FORMAT =
            DateTimeFormatter.ofPattern("MMM dd");

    public AdminServiceImpl(
            UserRepository userRepository,
            AuditLogRepository auditLogRepository,
            ReportRepository reportRepository,
            ForumPostRepository forumPostRepository
    ) {
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
        this.reportRepository = reportRepository;
        this.forumPostRepository = forumPostRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(AdminUserResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        List<User> all = userRepository.findAll();
        long totalUsers  = all.size();
        long totalAdmins = all.stream().filter(u -> u.getRole().name().equals("ADMIN")).count();
        long totalBanned = all.stream().filter(u -> u.getStatus() == UserStatus.BANNED).count();
        return new AdminStatsResponse(totalUsers, totalAdmins, totalBanned);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminAnalyticsResponse getAnalytics() {
        List<Report> allReports = reportRepository.findAll();
        List<User> allUsers = userRepository.findAll();

        // ── Reports by day (last 30 days) ─────────────────────────────────────
        Map<String, Long> reportDayMap = allReports.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getCreatedAt().format(DAY_FORMAT),
                        Collectors.counting()
                ));

        List<AdminAnalyticsResponse.DailyReportCount> reportsByDay = reportDayMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new AdminAnalyticsResponse.DailyReportCount(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        // ── Reports by category ───────────────────────────────────────────────
        Map<ReportCategory, Long> categoryMap = allReports.stream()
                .collect(Collectors.groupingBy(Report::getCategory, Collectors.counting()));

        List<AdminAnalyticsResponse.CategoryCount> reportsByCategory =
                Arrays.stream(ReportCategory.values())
                        .map(cat -> new AdminAnalyticsResponse.CategoryCount(
                                formatCategory(cat.name()),
                                categoryMap.getOrDefault(cat, 0L)
                        ))
                        .collect(Collectors.toList());

        // ── Reports by status ─────────────────────────────────────────────────
        Map<ReportStatus, Long> statusMap = allReports.stream()
                .collect(Collectors.groupingBy(Report::getStatus, Collectors.counting()));

        List<AdminAnalyticsResponse.StatusCount> reportsByStatus =
                Arrays.stream(ReportStatus.values())
                        .map(st -> new AdminAnalyticsResponse.StatusCount(
                                formatStatus(st.name()),
                                statusMap.getOrDefault(st, 0L)
                        ))
                        .collect(Collectors.toList());

        // ── User registrations by day ─────────────────────────────────────────
        Map<String, Long> regDayMap = allUsers.stream()
                .collect(Collectors.groupingBy(
                        u -> u.getCreatedAt().format(DAY_FORMAT),
                        Collectors.counting()
                ));

        List<AdminAnalyticsResponse.DailyReportCount> registrationsByDay = regDayMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new AdminAnalyticsResponse.DailyReportCount(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        // ── Summary stats ─────────────────────────────────────────────────────
        long totalReports = allReports.size();

        // Critical = SAFETY category or SUBMITTED status with MENTAL_HEALTH
        // (will be replaced by sentiment score once teammate integrates it)
        long criticalReports = allReports.stream()
                .filter(r -> r.getCategory() == ReportCategory.SAFETY ||
                             r.getCategory() == ReportCategory.HARASSMENT)
                .count();

        long pendingReports = allReports.stream()
                .filter(r -> r.getStatus() == ReportStatus.SUBMITTED)
                .count();

        long totalUsers = allUsers.size();
        long totalForumPosts = forumPostRepository.count();

        return new AdminAnalyticsResponse(
                reportsByDay,
                reportsByCategory,
                reportsByStatus,
                registrationsByDay,
                totalReports,
                criticalReports,
                pendingReports,
                totalUsers,
                totalForumPosts
        );
    }

    @Override
    @Transactional
    public AdminUserResponse changeRole(String actorEmail, Long targetUserId, ChangeRoleRequest request) {
        User actor = getUserByEmail(actorEmail);
        User target = getUserById(targetUserId);

        String oldRole = target.getRole().name();
        target.setRole(request.getRole());
        userRepository.save(target);

        auditLogRepository.save(new AuditLog(
                actor,
                AuditAction.ROLE_CHANGED,
                target.getEmail(),
                "Changed role from " + oldRole + " to " + request.getRole().name() + "."
        ));

        return AdminUserResponse.from(target);
    }

    @Override
    @Transactional
    public AdminUserResponse banUser(String actorEmail, Long targetUserId) {
        User actor = getUserByEmail(actorEmail);
        User target = getUserById(targetUserId);

        if (target.getStatus() == UserStatus.BANNED) {
            throw new BadRequestException("User is already banned");
        }

        target.setStatus(UserStatus.BANNED);
        userRepository.save(target);

        auditLogRepository.save(new AuditLog(
                actor,
                AuditAction.USER_BANNED,
                target.getEmail(),
                "User account was restricted by admin."
        ));

        return AdminUserResponse.from(target);
    }

    @Override
    @Transactional
    public AdminUserResponse unbanUser(String actorEmail, Long targetUserId) {
        User actor = getUserByEmail(actorEmail);
        User target = getUserById(targetUserId);

        if (target.getStatus() != UserStatus.BANNED) {
            throw new BadRequestException("User is not banned");
        }

        target.setStatus(UserStatus.ACTIVE);
        userRepository.save(target);

        auditLogRepository.save(new AuditLog(
                actor,
                AuditAction.USER_UNBANNED,
                target.getEmail(),
                "User account restriction was lifted by admin."
        ));

        return AdminUserResponse.from(target);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLog() {
        return auditLogRepository.findAllByOrderByOccurredAtDesc()
                .stream()
                .map(AuditLogResponse::from)
                .toList();
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    private User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    private String formatCategory(String raw) {
        return switch (raw) {
            case "HARASSMENT" -> "Harassment";
            case "DISCRIMINATION" -> "Discrimination";
            case "MENTAL_HEALTH" -> "Mental Health";
            case "SAFETY" -> "Safety";
            case "OTHER" -> "Other";
            default -> raw;
        };
    }

    private String formatStatus(String raw) {
        return switch (raw) {
            case "SUBMITTED" -> "Submitted";
            case "IN_REVIEW" -> "In Review";
            case "RESOLVED" -> "Resolved";
            case "CLOSED" -> "Closed";
            default -> raw;
        };
    }
}