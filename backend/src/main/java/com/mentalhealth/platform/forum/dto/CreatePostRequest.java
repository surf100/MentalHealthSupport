package com.mentalhealth.platform.forum.dto;

import com.mentalhealth.platform.forum.entity.ForumCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreatePostRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be under 255 characters")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Category is required")
    private ForumCategory category;

    private boolean anonymous = false;

    public String getTitle() { return title; }
    public String getContent() { return content; }
    public ForumCategory getCategory() { return category; }
    public boolean isAnonymous() { return anonymous; }

    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setCategory(ForumCategory category) { this.category = category; }
    public void setAnonymous(boolean anonymous) { this.anonymous = anonymous; }
}