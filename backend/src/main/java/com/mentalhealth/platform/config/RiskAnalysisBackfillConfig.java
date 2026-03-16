package com.mentalhealth.platform.config;

import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.mentalhealth.platform.forum.entity.ForumPost;
import com.mentalhealth.platform.forum.entity.ForumPostModerationStatus;
import com.mentalhealth.platform.forum.event.ForumPostCreatedEvent;
import com.mentalhealth.platform.forum.repository.ForumPostRepository;
import com.mentalhealth.platform.report.entity.Report;
import com.mentalhealth.platform.report.event.ReportCreatedEvent;
import com.mentalhealth.platform.report.repository.ReportRepository;

@Component
public class RiskAnalysisBackfillConfig {

    private final ForumPostRepository forumPostRepository;
    private final ReportRepository reportRepository;
    private final ApplicationEventPublisher eventPublisher;

    public RiskAnalysisBackfillConfig(
            ForumPostRepository forumPostRepository,
            ReportRepository reportRepository,
            ApplicationEventPublisher eventPublisher
    ) {
        this.forumPostRepository = forumPostRepository;
        this.reportRepository = reportRepository;
        this.eventPublisher = eventPublisher;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void backfillPendingAnalysisOnStartup() {
        backfillPendingAnalysis();
    }

    @Scheduled(
            initialDelayString = "${ml.forum-risk.retry-initial-delay-ms:15000}",
            fixedDelayString = "${ml.forum-risk.retry-fixed-delay-ms:60000}"
    )
    public void backfillPendingAnalysis() {
        List<ForumPost> pendingPosts = forumPostRepository
                .findByModerationStatusAndAnalyzedAtIsNullOrderByCreatedAtDesc(ForumPostModerationStatus.PENDING_ANALYSIS);
        for (ForumPost post : pendingPosts) {
            eventPublisher.publishEvent(new ForumPostCreatedEvent(post.getId()));
        }

        List<ForumPost> failedPosts = forumPostRepository
                .findByModerationStatusOrderByCreatedAtDesc(ForumPostModerationStatus.ANALYSIS_FAILED);
        for (ForumPost post : failedPosts) {
            eventPublisher.publishEvent(new ForumPostCreatedEvent(post.getId()));
        }

        List<Report> pendingReports = reportRepository
                .findByModerationStatusAndAnalyzedAtIsNullOrderByCreatedAtDesc(ForumPostModerationStatus.PENDING_ANALYSIS);
        for (Report report : pendingReports) {
            eventPublisher.publishEvent(new ReportCreatedEvent(report.getId()));
        }

        List<Report> failedReports = reportRepository
                .findByModerationStatusOrderByCreatedAtDesc(ForumPostModerationStatus.ANALYSIS_FAILED);
        for (Report report : failedReports) {
            eventPublisher.publishEvent(new ReportCreatedEvent(report.getId()));
        }
    }
}
