package com.mentalhealth.platform.forum.dto;

public class LikeResponse {

    private boolean liked;
    private long likeCount;

    public LikeResponse(boolean liked, long likeCount) {
        this.liked = liked;
        this.likeCount = likeCount;
    }

    public boolean isLiked() { return liked; }
    public long getLikeCount() { return likeCount; }
}