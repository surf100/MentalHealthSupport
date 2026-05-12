package com.mentalhealth.platform.report.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.mentalhealth.platform.forum.entity.ForumPostModerationStatus;
import com.mentalhealth.platform.forum.service.ForumPostRiskAnalysisResult;
import com.mentalhealth.platform.forum.service.ForumPostRiskAnalyzer;
import com.mentalhealth.platform.notification.entity.Notification;
import com.mentalhealth.platform.notification.entity.NotificationType;
import com.mentalhealth.platform.notification.repository.NotificationRepository;
import com.mentalhealth.platform.report.entity.Report;
import com.mentalhealth.platform.report.event.ReportCreatedEvent;
import com.mentalhealth.platform.report.repository.ReportRepository;
import com.mentalhealth.platform.user.entity.User;
import com.mentalhealth.platform.user.enums.UserRole;
import com.mentalhealth.platform.user.repository.UserRepository;

@Service
public class ReportRiskAnalysisService {

    private final ReportRepository reportRepository;
    private final ForumPostRiskAnalyzer forumPostRiskAnalyzer;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public ReportRiskAnalysisService(
            ReportRepository reportRepository,
            ForumPostRiskAnalyzer forumPostRiskAnalyzer,
            UserRepository userRepository,
            NotificationRepository notificationRepository
    ) {
        this.reportRepository = reportRepository;
        this.forumPostRiskAnalyzer = forumPostRiskAnalyzer;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void analyzeReportAsync(ReportCreatedEvent event) {
        reportRepository.findById(event.getReportId()).ifPresent(report -> {
            try {
                ForumPostRiskAnalysisResult result = forumPostRiskAnalyzer.analyze(
                        report.getTitle(),
                        report.getDescription(),
                        report.getCategory().name()
                );

                report.setSentimentScore(result.getSentimentScore());
                report.setRiskScore(result.getRiskScore());
                report.setRiskLevel(result.getRiskLevel());
                report.setFlaggedForReview(result.isFlaggedForReview());
                report.setRiskSummary(result.getSummary());
                report.setAnalyzedAt(LocalDateTime.now());
                report.setModerationNotes("Analyzed with AI moderation service.");
                report.setModerationStatus(
                        result.isFlaggedForReview()
                                ? ForumPostModerationStatus.FLAGGED
                                : ForumPostModerationStatus.CLEAR
                );
                reportRepository.save(report);

                if (result.isFlaggedForReview()) {
                    notifyAdmins(report);
                }
            } catch (RuntimeException ex) {
                report.setAnalyzedAt(LocalDateTime.now());
                report.setFlaggedForReview(false);
                report.setModerationStatus(ForumPostModerationStatus.ANALYSIS_FAILED);
                report.setModerationNotes("AI moderation analysis failed: " + ex.getMessage());
                reportRepository.save(report);
            }
        });
    }

    private void notifyAdmins(Report report) {
        List<User> admins = userRepository.findByRole(UserRole.ADMIN);

        for (User admin : admins) {
            Notification notification = new Notification();
            notification.setUser(admin);
            notification.setType(NotificationType.WARNING);
            notification.setTitle("High-risk anonymous report flagged");
            notification.setMessage(
                    "Report RS-" + report.getId()
                            + " scored " + report.getRiskScore()
                            + "/100 and requires moderator review."
            );
            notificationRepository.save(notification);
        }
    }
}
