package com.mentalhealth.platform.forum.dto;

import java.time.LocalDateTime;

import com.mentalhealth.platform.forum.entity.ForumPost;

public class ForumModerationQueueItemResponse {

    private Long id;
    private String title;
    private String content;
    private String category;
    private String authorNickname;
    private String authorEmail;
    private boolean anonymousToCommunity;
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

    public ForumModerationQueueItemResponse() {
    }

    public static ForumModerationQueueItemResponse from(ForumPost post) {
        ForumModerationQueueItemResponse dto = new ForumModerationQueueItemResponse();
        dto.id = post.getId();
        dto.title = post.getTitle();
        dto.content = post.getContent();
        dto.category = post.getCategory().name();
        dto.authorNickname = post.getUser().getNickname();
        dto.authorEmail = post.getUser().getEmail();
        dto.anonymousToCommunity = post.isAnonymous();
        dto.riskScore = post.getRiskScore();
        dto.sentimentScore = post.getSentimentScore();
        dto.riskLevel = post.getRiskLevel().name();
        dto.moderationStatus = post.getModerationStatus().name();
        dto.flaggedForReview = post.isFlaggedForReview();
        dto.riskSummary = post.getRiskSummary();
        dto.moderationNotes = post.getModerationNotes();
        dto.analyzedAt = post.getAnalyzedAt();
        dto.reviewedAt = post.getReviewedAt();
        dto.specialistReferredAt = post.getSpecialistReferredAt();
        dto.createdAt = post.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getCategory() { return category; }
    public String getAuthorNickname() { return authorNickname; }
    public String getAuthorEmail() { return authorEmail; }
    public boolean isAnonymousToCommunity() { return anonymousToCommunity; }
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
