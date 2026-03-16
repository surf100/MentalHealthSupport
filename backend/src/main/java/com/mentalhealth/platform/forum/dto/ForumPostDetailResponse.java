package com.mentalhealth.platform.forum.dto;

import com.mentalhealth.platform.forum.entity.ForumPost;

import java.time.LocalDateTime;
import java.util.List;

public class ForumPostDetailResponse {

    private Long id;
    private String title;
    private String content;
    private String category;
    private String author;
    private long likeCount;
    private boolean likedByMe;
    private LocalDateTime createdAt;
    private List<ForumCommentResponse> comments;
    private int riskScore;
    private String riskLevel;
    private String moderationStatus;
    private String riskSummary;

    public ForumPostDetailResponse() {}

    public static ForumPostDetailResponse from(
            ForumPost post,
            long likeCount,
            boolean likedByMe,
            List<ForumCommentResponse> comments
    ) {
        ForumPostDetailResponse dto = new ForumPostDetailResponse();
        dto.id = post.getId();
        dto.title = post.getTitle();
        dto.content = post.getContent();
        dto.category = post.getCategory().name();
        dto.author = post.isAnonymous() ? "Anonymous" : post.getUser().getNickname();
        dto.likeCount = likeCount;
        dto.likedByMe = likedByMe;
        dto.createdAt = post.getCreatedAt();
        dto.comments = comments;
        dto.riskScore = post.getRiskScore();
        dto.riskLevel = post.getRiskLevel().name();
        dto.moderationStatus = post.getModerationStatus().name();
        dto.riskSummary = post.getRiskSummary();
        return dto;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getCategory() { return category; }
    public String getAuthor() { return author; }
    public long getLikeCount() { return likeCount; }
    public boolean isLikedByMe() { return likedByMe; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<ForumCommentResponse> getComments() { return comments; }
    public int getRiskScore() { return riskScore; }
    public String getRiskLevel() { return riskLevel; }
    public String getModerationStatus() { return moderationStatus; }
    public String getRiskSummary() { return riskSummary; }
}
