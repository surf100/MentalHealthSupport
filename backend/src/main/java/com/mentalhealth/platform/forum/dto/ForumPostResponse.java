package com.mentalhealth.platform.forum.dto;

import java.time.LocalDateTime;

import com.mentalhealth.platform.forum.entity.ForumPost;

public class ForumPostResponse {

    private Long id;
    private String title;
    private String preview;
    private String category;
    private String author;
    private long commentCount;
    private long likeCount;
    private boolean likedByMe;
    private LocalDateTime createdAt;

    public ForumPostResponse() {}

    public static ForumPostResponse from(ForumPost post, long commentCount, long likeCount, boolean likedByMe) {
        ForumPostResponse dto = new ForumPostResponse();
        dto.id = post.getId();
        dto.title = post.getTitle();
        // preview — first 150 chars of content
        String content = post.getContent();
        dto.preview = content.length() > 150 ? content.substring(0, 150) + "..." : content;
        dto.category = post.getCategory().name();
        dto.author = post.isAnonymous() ? "Anonymous" : post.getUser().getNickname();
        dto.commentCount = commentCount;
        dto.likeCount = likeCount;
        dto.likedByMe = likedByMe;
        dto.createdAt = post.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getPreview() { return preview; }
    public String getCategory() { return category; }
    public String getAuthor() { return author; }
    public long getCommentCount() { return commentCount; }
    public long getLikeCount() { return likeCount; }
    public boolean isLikedByMe() { return likedByMe; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}