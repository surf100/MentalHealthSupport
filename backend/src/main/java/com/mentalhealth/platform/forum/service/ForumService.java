package com.mentalhealth.platform.forum.service;

import com.mentalhealth.platform.forum.dto.*;
import com.mentalhealth.platform.forum.entity.ForumCategory;

import java.util.List;

public interface ForumService {

    List<ForumPostResponse> getPosts(String email, ForumCategory category);

    ForumPostDetailResponse getPostById(String email, Long postId);

    ForumPostResponse createPost(String email, CreatePostRequest request);

    ForumCommentResponse addComment(String email, Long postId, CreateCommentRequest request);

    LikeResponse toggleLike(String email, Long postId);
}