package com.mentalhealth.platform.forum.dto;

import java.time.LocalDateTime;

import com.mentalhealth.platform.forum.entity.ForumComment;

public class ForumCommentResponse {

    private Long id;
    private String author;
    private String content;
    private LocalDateTime createdAt;

    public ForumCommentResponse() {}

    public static ForumCommentResponse from(ForumComment comment) {
        ForumCommentResponse dto = new ForumCommentResponse();
        dto.id = comment.getId();
        dto.author = comment.isAnonymous() ? "Anonymous" : comment.getUser().getNickname();
        dto.content = comment.getContent();
        dto.createdAt = comment.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public String getAuthor() { return author; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}