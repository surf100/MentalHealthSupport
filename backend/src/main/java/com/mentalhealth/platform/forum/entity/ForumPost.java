package com.mentalhealth.platform.forum.entity;

import com.mentalhealth.platform.user.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "forum_posts")
public class ForumPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ForumCategory category;

    @Column(name = "is_anonymous", nullable = false)
    private boolean anonymous = false;

    @Column(name = "sentiment_score", nullable = false)
    private double sentimentScore = 0.0;

    @Column(name = "risk_score", nullable = false)
    private int riskScore = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false, length = 20)
    private ForumPostRiskLevel riskLevel = ForumPostRiskLevel.LOW;

    @Enumerated(EnumType.STRING)
    @Column(name = "moderation_status", nullable = false, length = 40)
    private ForumPostModerationStatus moderationStatus = ForumPostModerationStatus.PENDING_ANALYSIS;

    @Column(name = "flagged_for_review", nullable = false)
    private boolean flaggedForReview = false;

    @Column(name = "risk_summary", length = 500)
    private String riskSummary;

    @Column(name = "moderation_notes", length = 1000)
    private String moderationNotes;

    @Column(name = "analyzed_at")
    private LocalDateTime analyzedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "specialist_referred_at")
    private LocalDateTime specialistReferredAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public ForumPost() {}

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public ForumCategory getCategory() { return category; }
    public boolean isAnonymous() { return anonymous; }
    public double getSentimentScore() { return sentimentScore; }
    public int getRiskScore() { return riskScore; }
    public ForumPostRiskLevel getRiskLevel() { return riskLevel; }
    public ForumPostModerationStatus getModerationStatus() { return moderationStatus; }
    public boolean isFlaggedForReview() { return flaggedForReview; }
    public String getRiskSummary() { return riskSummary; }
    public String getModerationNotes() { return moderationNotes; }
    public LocalDateTime getAnalyzedAt() { return analyzedAt; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public LocalDateTime getSpecialistReferredAt() { return specialistReferredAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setCategory(ForumCategory category) { this.category = category; }
    public void setAnonymous(boolean anonymous) { this.anonymous = anonymous; }
    public void setSentimentScore(double sentimentScore) { this.sentimentScore = sentimentScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }
    public void setRiskLevel(ForumPostRiskLevel riskLevel) { this.riskLevel = riskLevel; }
    public void setModerationStatus(ForumPostModerationStatus moderationStatus) { this.moderationStatus = moderationStatus; }
    public void setFlaggedForReview(boolean flaggedForReview) { this.flaggedForReview = flaggedForReview; }
    public void setRiskSummary(String riskSummary) { this.riskSummary = riskSummary; }
    public void setModerationNotes(String moderationNotes) { this.moderationNotes = moderationNotes; }
    public void setAnalyzedAt(LocalDateTime analyzedAt) { this.analyzedAt = analyzedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
    public void setSpecialistReferredAt(LocalDateTime specialistReferredAt) { this.specialistReferredAt = specialistReferredAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
