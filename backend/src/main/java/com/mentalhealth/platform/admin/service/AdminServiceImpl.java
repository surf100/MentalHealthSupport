package com.mentalhealth.platform.admin.service;

import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentalhealth.platform.admin.dto.AdminAnalyticsResponse;
import com.mentalhealth.platform.admin.dto.AdminStatsResponse;
import com.mentalhealth.platform.admin.dto.AdminUserResponse;
import com.mentalhealth.platform.admin.dto.AuditLogResponse;
import com.mentalhealth.platform.admin.dto.ChangeRoleRequest;
import com.mentalhealth.platform.admin.dto.SpecialistResponseRequest;
import com.mentalhealth.platform.admin.entity.AuditAction;
import com.mentalhealth.platform.admin.entity.AuditLog;
import com.mentalhealth.platform.admin.repository.AuditLogRepository;
import com.mentalhealth.platform.common.exception.BadRequestException;
import com.mentalhealth.platform.forum.dto.ForumModerationQueueItemResponse;
import com.mentalhealth.platform.forum.entity.ForumPost;
import com.mentalhealth.platform.forum.entity.ForumPostModerationStatus;
import com.mentalhealth.platform.forum.entity.ForumPostRiskLevel;
import com.mentalhealth.platform.forum.repository.ForumPostRepository;
import com.mentalhealth.platform.notification.entity.Notification;
import com.mentalhealth.platform.notification.entity.NotificationType;
import com.mentalhealth.platform.notification.repository.NotificationRepository;
import com.mentalhealth.platform.report.dto.ReportModerationQueueItemResponse;
import com.mentalhealth.platform.report.entity.Report;
import com.mentalhealth.platform.report.entity.ReportCategory;
import com.mentalhealth.platform.report.entity.ReportStatus;
import com.mentalhealth.platform.report.entity.ReportStatusHistory;
import com.mentalhealth.platform.report.repository.ReportRepository;
import com.mentalhealth.platform.report.repository.ReportStatusHistoryRepository;
import com.mentalhealth.platform.user.entity.User;
import com.mentalhealth.platform.user.enums.UserRole;
import com.mentalhealth.platform.user.enums.UserStatus;
import com.mentalhealth.platform.user.repository.UserRepository;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final ReportRepository reportRepository;
    private final ForumPostRepository forumPostRepository;
    private final ReportStatusHistoryRepository reportStatusHistoryRepository;
    private final NotificationRepository notificationRepository;

    private static final DateTimeFormatter DAY_FORMAT =
            DateTimeFormatter.ofPattern("MMM dd");

    public AdminServiceImpl(
            UserRepository userRepository,
            AuditLogRepository auditLogRepository,
            ReportRepository reportRepository,
            ForumPostRepository forumPostRepository,
            ReportStatusHistoryRepository reportStatusHistoryRepository,
            NotificationRepository notificationRepository
    ) {
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
        this.reportRepository = reportRepository;
        this.forumPostRepository = forumPostRepository;
        this.reportStatusHistoryRepository = reportStatusHistoryRepository;
        this.notificationRepository = notificationRepository;
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

        Map<String, Long> reportDayMap = allReports.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getCreatedAt().format(DAY_FORMAT),
                        Collectors.counting()
                ));

        List<AdminAnalyticsResponse.DailyReportCount> reportsByDay = reportDayMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new AdminAnalyticsResponse.DailyReportCount(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        Map<ReportCategory, Long> categoryMap = allReports.stream()
                .collect(Collectors.groupingBy(Report::getCategory, Collectors.counting()));

        List<AdminAnalyticsResponse.CategoryCount> reportsByCategory =
                Arrays.stream(ReportCategory.values())
                        .map(cat -> new AdminAnalyticsResponse.CategoryCount(
                                formatCategory(cat.name()),
                                categoryMap.getOrDefault(cat, 0L)
                        ))
                        .collect(Collectors.toList());

        Map<ReportStatus, Long> statusMap = allReports.stream()
                .collect(Collectors.groupingBy(Report::getStatus, Collectors.counting()));

        List<AdminAnalyticsResponse.StatusCount> reportsByStatus =
                Arrays.stream(ReportStatus.values())
                        .map(st -> new AdminAnalyticsResponse.StatusCount(
                                formatStatus(st.name()),
                                statusMap.getOrDefault(st, 0L)
                        ))
                        .collect(Collectors.toList());

        Map<String, Long> regDayMap = allUsers.stream()
                .collect(Collectors.groupingBy(
                        u -> u.getCreatedAt().format(DAY_FORMAT),
                        Collectors.counting()
                ));

        List<AdminAnalyticsResponse.DailyReportCount> registrationsByDay = regDayMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new AdminAnalyticsResponse.DailyReportCount(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        long totalReports = allReports.size();
        long criticalReports = allReports.stream()
                .filter(r -> r.getCategory() == ReportCategory.SAFETY ||
                             r.getCategory() == ReportCategory.HARASSMENT)
                .count();
        long pendingReports = allReports.stream()
                .filter(r -> r.getStatus() == ReportStatus.SUBMITTED)
                .count();
        long totalUsers2 = allUsers.size();
        long totalForumPosts = forumPostRepository.count();
        long flaggedForumPosts = forumPostRepository.countByFlaggedForReviewTrue();
        long pendingForumModeration = forumPostRepository.countByModerationStatus(ForumPostModerationStatus.FLAGGED);
        long specialistEscalations =
                forumPostRepository.countByModerationStatus(ForumPostModerationStatus.ESCALATED_TO_SPECIALIST);
        long criticalForumPosts =
                forumPostRepository.countByRiskLevelIn(List.of(ForumPostRiskLevel.HIGH, ForumPostRiskLevel.CRITICAL));

        return new AdminAnalyticsResponse(
                reportsByDay, reportsByCategory, reportsByStatus, registrationsByDay,
                totalReports, criticalReports, pendingReports, totalUsers2,
                totalForumPosts, flaggedForumPosts, pendingForumModeration,
                specialistEscalations, criticalForumPosts
        );
    }

    @Override
    @Transactional
    public AdminUserResponse changeRole(String actorEmail, Long targetUserId, ChangeRoleRequest request) {
        User actor = getUserByEmail(actorEmail);
        requireAdmin(actor);
        User target = getUserById(targetUserId);

        if (actor.getId().equals(target.getId()))
            throw new BadRequestException("Admins cannot change their own role");
        if (target.getRole() == request.getRole())
            throw new BadRequestException("User already has this role");

        String oldRole = target.getRole().name();
        target.setRole(request.getRole());
        userRepository.save(target);

        auditLogRepository.save(new AuditLog(actor, AuditAction.ROLE_CHANGED, target.getEmail(),
                "Changed role from " + oldRole + " to " + request.getRole().name() + "."));

        return AdminUserResponse.from(target);
    }

    @Override
    @Transactional
    public AdminUserResponse banUser(String actorEmail, Long targetUserId) {
        User actor = getUserByEmail(actorEmail);
        requireAdmin(actor);
        User target = getUserById(targetUserId);

        if (actor.getId().equals(target.getId()))
            throw new BadRequestException("Admins cannot ban themselves");
        if (target.getStatus() == UserStatus.BANNED)
            throw new BadRequestException("User is already banned");

        target.setStatus(UserStatus.BANNED);
        userRepository.save(target);

        auditLogRepository.save(new AuditLog(actor, AuditAction.USER_BANNED, target.getEmail(),
                "User account was restricted by admin."));

        // Notify the banned user
        saveNotification(target, NotificationType.WARNING,
                "Your account has been suspended",
                "Your account has been suspended by a platform administrator. Contact support if you believe this is a mistake.");

        return AdminUserResponse.from(target);
    }

    @Override
    @Transactional
    public AdminUserResponse unbanUser(String actorEmail, Long targetUserId) {
        User actor = getUserByEmail(actorEmail);
        requireAdmin(actor);
        User target = getUserById(targetUserId);

        if (target.getStatus() != UserStatus.BANNED)
            throw new BadRequestException("User is not banned");

        target.setStatus(UserStatus.ACTIVE);
        userRepository.save(target);

        auditLogRepository.save(new AuditLog(actor, AuditAction.USER_UNBANNED, target.getEmail(),
                "User account restriction was lifted by admin."));

        // Notify the unbanned user
        saveNotification(target, NotificationType.SYSTEM,
                "Your account has been reinstated",
                "Your account suspension has been lifted. You can now use the platform again.");

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

    @Override
    @Transactional(readOnly = true)
    public List<ForumModerationQueueItemResponse> getForumModerationPosts() {
        return forumPostRepository.findAllByOrderByFlaggedForReviewDescRiskScoreDescCreatedAtDesc()
                .stream()
                .map(ForumModerationQueueItemResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportModerationQueueItemResponse> getReportModerationReports() {
        return reportRepository.findAllByOrderByFlaggedForReviewDescRiskScoreDescCreatedAtDesc()
                .stream()
                .map(ReportModerationQueueItemResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public ForumModerationQueueItemResponse reviewFlaggedForumPost(String actorEmail, Long postId) {
        return updateForumPostModerationStatus(actorEmail, postId,
                ForumPostModerationStatus.REVIEWED, AuditAction.FORUM_POST_REVIEWED,
                "Reviewed flagged forum post");
    }

    @Override
    @Transactional
    public ForumModerationQueueItemResponse dismissFlaggedForumPost(String actorEmail, Long postId) {
        return updateForumPostModerationStatus(actorEmail, postId,
                ForumPostModerationStatus.DISMISSED, AuditAction.FORUM_POST_DISMISSED,
                "Dismissed flagged forum post");
    }

    @Override
    @Transactional
    public ForumModerationQueueItemResponse escalateFlaggedForumPost(String actorEmail, Long postId) {
        return updateForumPostModerationStatus(actorEmail, postId,
                ForumPostModerationStatus.ESCALATED_TO_SPECIALIST,
                AuditAction.FORUM_POST_ESCALATED_TO_SPECIALIST,
                "Escalated forum post to mental health specialists");
    }

    @Override
    @Transactional
    public ReportModerationQueueItemResponse reviewFlaggedReport(String actorEmail, Long reportId) {
        return updateReportModerationStatus(actorEmail, reportId,
                ForumPostModerationStatus.REVIEWED, AuditAction.REPORT_REVIEWED,
                "Reviewed flagged report", ReportStatus.UNDER_REVIEW);
    }

    @Override
    @Transactional
    public ReportModerationQueueItemResponse dismissFlaggedReport(String actorEmail, Long reportId) {
        return updateReportModerationStatus(actorEmail, reportId,
                ForumPostModerationStatus.DISMISSED, AuditAction.REPORT_DISMISSED,
                "Dismissed flagged report", null);
    }

    @Override
    @Transactional
    public ReportModerationQueueItemResponse escalateFlaggedReport(String actorEmail, Long reportId) {
        return updateReportModerationStatus(actorEmail, reportId,
                ForumPostModerationStatus.ESCALATED_TO_SPECIALIST,
                AuditAction.REPORT_ESCALATED_TO_SPECIALIST,
                "Escalated report to mental health specialists", ReportStatus.UNDER_REVIEW);
    }

    @Override
    @Transactional
    public ReportModerationQueueItemResponse revealAnonymousReportIdentity(String actorEmail, Long reportId) {
        User actor = getUserByEmail(actorEmail);
        requireSpecialist(actor);

        Report report = getReportById(reportId);
        if (!report.isAnonymous())
            throw new BadRequestException("Only anonymous reports can be de-anonymized");
        if (report.getModerationStatus() != ForumPostModerationStatus.ESCALATED_TO_SPECIALIST)
            throw new BadRequestException("Only escalated specialist cases can reveal reporter identity");
        if (report.isIdentityRevealedToSpecialist())
            throw new BadRequestException("Reporter identity has already been revealed");

        report.setIdentityRevealedToSpecialist(true);
        report.setIdentityRevealedAt(java.time.LocalDateTime.now());
        report.setModerationNotes("Reporter identity was revealed to a specialist for an escalated case.");
        Report savedReport = reportRepository.save(report);

        auditLogRepository.save(new AuditLog(actor, AuditAction.REPORT_IDENTITY_REVEALED,
                "report#" + savedReport.getId(),
                "Revealed anonymous reporter identity for specialist review."));

        return ReportModerationQueueItemResponse.from(savedReport);
    }

    @Override
    @Transactional
    public ReportModerationQueueItemResponse addSpecialistResponse(
            String actorEmail, Long reportId, SpecialistResponseRequest request) {

        User actor = getUserByEmail(actorEmail);
        requireModerator(actor, true);

        Report report = getReportById(reportId);
        if (report.getModerationStatus() != ForumPostModerationStatus.ESCALATED_TO_SPECIALIST)
            throw new BadRequestException("Only reports escalated to specialists can receive a specialist response");

        String message = request.getMessage().trim();
        report.setStatus(ReportStatus.RESOLVED);
        report.setReviewedAt(java.time.LocalDateTime.now());
        report.setModerationNotes("Specialist response sent. Reporter notified.");
        Report savedReport = reportRepository.save(report);

        reportStatusHistoryRepository.save(new ReportStatusHistory(
                savedReport, ReportStatus.RESOLVED, "Specialist response sent", message));

        saveNotification(savedReport.getUser(), NotificationType.REPORT_UPDATE,
                "A mental health specialist responded to your report",
                "A specialist added a response to report RS-" + savedReport.getId() + ".");

        auditLogRepository.save(new AuditLog(actor, AuditAction.REPORT_SPECIALIST_RESPONDED,
                "report#" + savedReport.getId(),
                "Added specialist response for report submitted by " + savedReport.getUser().getEmail() + "."));

        return ReportModerationQueueItemResponse.from(savedReport);
    }

    @Override
@Transactional
public ForumModerationQueueItemResponse addForumSpecialistNote(
        String actorEmail, Long postId, SpecialistResponseRequest request) {

    User actor = getUserByEmail(actorEmail);
    requireModerator(actor, true); // true = specialist тоже может

    ForumPost post = getForumPostById(postId);
    if (post.getModerationStatus() != ForumPostModerationStatus.ESCALATED_TO_SPECIALIST)
        throw new BadRequestException("Only forum posts escalated to specialists can receive a specialist note");

    String message = request.getMessage().trim();
    post.setSpecialistNote(message);
    ForumPost savedPost = forumPostRepository.save(post);

    auditLogRepository.save(new AuditLog(actor, AuditAction.FORUM_POST_SPECIALIST_NOTE_ADDED,
            "forum-post#" + savedPost.getId(),
            "Added internal specialist note for forum post by " + savedPost.getUser().getEmail() + "."));

    return ForumModerationQueueItemResponse.from(savedPost);
}

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private void saveNotification(User user, NotificationType type, String title, String message) {
        Notification n = new Notification();
        n.setUser(user);
        n.setType(type);
        n.setTitle(title);
        n.setMessage(message);
        notificationRepository.save(n);
    }

    private ForumModerationQueueItemResponse updateForumPostModerationStatus(
            String actorEmail, Long postId,
            ForumPostModerationStatus status, AuditAction auditAction, String actionText) {

        User actor = getUserByEmail(actorEmail);
        requireModerator(actor, false);

        ForumPost post = getForumPostById(postId);
        post.setModerationStatus(status);
        post.setFlaggedForReview(false);
        post.setReviewedAt(java.time.LocalDateTime.now());
        post.setModerationNotes(actionText + " at risk score " + post.getRiskScore() + "/100.");

        if (status == ForumPostModerationStatus.ESCALATED_TO_SPECIALIST)
            post.setSpecialistReferredAt(java.time.LocalDateTime.now());

        ForumPost savedPost = forumPostRepository.save(post);

        auditLogRepository.save(new AuditLog(actor, auditAction,
                "forum-post#" + savedPost.getId(),
                actionText + " for user " + savedPost.getUser().getEmail() + "."));

        // Notify the post author about moderation action
        if (status == ForumPostModerationStatus.ESCALATED_TO_SPECIALIST) {
            saveNotification(savedPost.getUser(), NotificationType.WARNING,
                    "Your post has been escalated for specialist review",
                    "Your forum post \"" + savedPost.getTitle() + "\" has been escalated to a mental health specialist due to its content.");
        } else if (status == ForumPostModerationStatus.DISMISSED) {
            saveNotification(savedPost.getUser(), NotificationType.WARNING,
                    "A safety flag on your post was reviewed",
                    "A content flag on your forum post \"" + savedPost.getTitle() + "\" was reviewed and dismissed by a moderator.");
        }

        return ForumModerationQueueItemResponse.from(savedPost);
    }

    private ReportModerationQueueItemResponse updateReportModerationStatus(
            String actorEmail, Long reportId,
            ForumPostModerationStatus moderationStatus, AuditAction auditAction,
            String actionText, ReportStatus reportStatus) {

        User actor = getUserByEmail(actorEmail);
        requireModerator(actor, false);

        Report report = getReportById(reportId);
        report.setModerationStatus(moderationStatus);
        report.setFlaggedForReview(false);
        report.setReviewedAt(java.time.LocalDateTime.now());
        report.setModerationNotes(actionText + " at risk score " + report.getRiskScore() + "/100.");

        if (moderationStatus == ForumPostModerationStatus.ESCALATED_TO_SPECIALIST)
            report.setSpecialistReferredAt(java.time.LocalDateTime.now());

        if (reportStatus != null) {
            report.setStatus(reportStatus);
            reportStatusHistoryRepository.save(new ReportStatusHistory(
                    report, reportStatus, actionText, actionText + " by a moderator."));
        }

        Report savedReport = reportRepository.save(report);

        auditLogRepository.save(new AuditLog(actor, auditAction,
                "report#" + savedReport.getId(),
                actionText + " for report submitted by " + savedReport.getUser().getEmail() + "."));

        // Notify the report author about moderation status change
        if (moderationStatus == ForumPostModerationStatus.REVIEWED && reportStatus == ReportStatus.UNDER_REVIEW) {
            saveNotification(savedReport.getUser(), NotificationType.REPORT_UPDATE,
                    "Your report is now under review",
                    "Report RS-" + savedReport.getId() + " is being reviewed by our moderation team.");
        } else if (moderationStatus == ForumPostModerationStatus.DISMISSED) {
            saveNotification(savedReport.getUser(), NotificationType.WARNING,
                    "Your report was reviewed",
                    "Report RS-" + savedReport.getId() + " was reviewed and closed by a moderator.");
        } else if (moderationStatus == ForumPostModerationStatus.ESCALATED_TO_SPECIALIST) {
            saveNotification(savedReport.getUser(), NotificationType.REPORT_UPDATE,
                    "Your report has been escalated",
                    "Report RS-" + savedReport.getId() + " has been escalated to a mental health specialist for further review.");
        }

        return ReportModerationQueueItemResponse.from(savedReport);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    private User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    private ForumPost getForumPostById(Long id) {
        return forumPostRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Forum post not found"));
    }

    private Report getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Report not found"));
    }

    private void requireAdmin(User actor) {
        if (actor.getRole() != UserRole.ADMIN)
            throw new BadRequestException("Only admins can manage user access");
    }

    private void requireModerator(User actor, boolean allowSpecialist) {
        boolean isAdmin = actor.getRole() == UserRole.ADMIN;
        boolean isSpecialist = actor.getRole() == UserRole.SPECIALIST;
        if (!isAdmin && !(allowSpecialist && isSpecialist))
            throw new BadRequestException("You do not have permission to handle moderation actions");
    }

    private void requireSpecialist(User actor) {
        if (actor.getRole() != UserRole.SPECIALIST)
            throw new BadRequestException("Only specialists can reveal anonymous reporter identity");
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