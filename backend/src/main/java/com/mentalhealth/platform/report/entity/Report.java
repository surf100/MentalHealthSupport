package com.mentalhealth.platform.report.entity;

import java.time.LocalDateTime;

import com.mentalhealth.platform.forum.entity.ForumPostModerationStatus;
import com.mentalhealth.platform.forum.entity.ForumPostRiskLevel;
import com.mentalhealth.platform.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 5000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ReportCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ReportStatus status;

    @Column(name = "is_anonymous", nullable = false)
    private boolean isAnonymous = true;

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

    @Column(name = "identity_revealed_to_specialist", nullable = false)
    private boolean identityRevealedToSpecialist = false;

    @Column(name = "identity_revealed_at")
    private LocalDateTime identityRevealedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Report() {
    }

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) {
            this.status = ReportStatus.SUBMITTED;
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public ReportCategory getCategory() { return category; }
    public ReportStatus getStatus() { return status; }
    public boolean isAnonymous() { return isAnonymous; }
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
    public boolean isIdentityRevealedToSpecialist() { return identityRevealedToSpecialist; }
    public LocalDateTime getIdentityRevealedAt() { return identityRevealedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setCategory(ReportCategory category) { this.category = category; }
    public void setStatus(ReportStatus status) { this.status = status; }
    public void setAnonymous(boolean anonymous) { isAnonymous = anonymous; }
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
    public void setIdentityRevealedToSpecialist(boolean identityRevealedToSpecialist) { this.identityRevealedToSpecialist = identityRevealedToSpecialist; }
    public void setIdentityRevealedAt(LocalDateTime identityRevealedAt) { this.identityRevealedAt = identityRevealedAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
