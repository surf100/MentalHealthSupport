package com.mentalhealth.platform.forum.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateCommentRequest {

    @NotBlank(message = "Content is required")
    private String content;

    private boolean anonymous = false;

    public String getContent() { return content; }
    public boolean isAnonymous() { return anonymous; }

    public void setContent(String content) { this.content = content; }
    public void setAnonymous(boolean anonymous) { this.anonymous = anonymous; }
}