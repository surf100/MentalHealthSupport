package com.mentalhealth.platform.report.dto;

import java.time.LocalDateTime;

import com.mentalhealth.platform.report.entity.Report;

public class ReportModerationQueueItemResponse {

    private Long id;
    private String reference;
    private String title;
    private String description;
    private String category;
    private String reportStatus;
    private String reporterEmail;
    private boolean anonymous;
    private int riskScore;
    private double sentimentScore;
    private String riskLevel;
    private String moderationStatus;
    private boolean flaggedForReview;
    private String riskSummary;
    private String moderationNotes;
    private LocalDateTime analyzedAt;
    private LocalDateTime reviewedAt;
    private LocalDateTime specialistReferredAt;
    private LocalDateTime createdAt;

    public static ReportModerationQueueItemResponse from(Report report) {
        ReportModerationQueueItemResponse dto = new ReportModerationQueueItemResponse();
        dto.id = report.getId();
        dto.reference = "RS-" + report.getId();
        dto.title = report.getTitle();
        dto.description = report.getDescription();
        dto.category = report.getCategory().name();
        dto.reportStatus = report.getStatus().name();
        dto.reporterEmail = report.getUser().getEmail();
        dto.anonymous = report.isAnonymous();
        dto.riskScore = report.getRiskScore();
        dto.sentimentScore = report.getSentimentScore();
        dto.riskLevel = report.getRiskLevel().name();
        dto.moderationStatus = report.getModerationStatus().name();
        dto.flaggedForReview = report.isFlaggedForReview();
        dto.riskSummary = report.getRiskSummary();
        dto.moderationNotes = report.getModerationNotes();
        dto.analyzedAt = report.getAnalyzedAt();
        dto.reviewedAt = report.getReviewedAt();
        dto.specialistReferredAt = report.getSpecialistReferredAt();
        dto.createdAt = report.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public String getReference() { return reference; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getReportStatus() { return reportStatus; }
    public String getReporterEmail() { return reporterEmail; }
    public boolean isAnonymous() { return anonymous; }
    public int getRiskScore() { return riskScore; }
    public double getSentimentScore() { return sentimentScore; }
    public String getRiskLevel() { return riskLevel; }
    public String getModerationStatus() { return moderationStatus; }
    public boolean isFlaggedForReview() { return flaggedForReview; }
    public String getRiskSummary() { return riskSummary; }
    public String getModerationNotes() { return moderationNotes; }
    public LocalDateTime getAnalyzedAt() { return analyzedAt; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public LocalDateTime getSpecialistReferredAt() { return specialistReferredAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
