package com.mentalhealth.platform.forum.event;

public class ForumPostCreatedEvent {

    private final Long postId;

    public ForumPostCreatedEvent(Long postId) {
        this.postId = postId;
    }

    public Long getPostId() {
        return postId;
    }
}
