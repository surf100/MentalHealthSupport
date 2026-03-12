package com.mentalhealth.platform.forum.controller;

import com.mentalhealth.platform.forum.dto.*;
import com.mentalhealth.platform.forum.entity.ForumCategory;
import com.mentalhealth.platform.forum.service.ForumService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forum")
public class ForumController {

    private final ForumService forumService;

    public ForumController(ForumService forumService) {
        this.forumService = forumService;
    }

    // GET /api/forum/posts?category=BULLYING_SUPPORT
    @GetMapping("/posts")
    public ResponseEntity<List<ForumPostResponse>> getPosts(
            Authentication authentication,
            @RequestParam(required = false) ForumCategory category
    ) {
        return ResponseEntity.ok(forumService.getPosts(authentication.getName(), category));
    }

    // GET /api/forum/posts/{id}
    @GetMapping("/posts/{id}")
    public ResponseEntity<ForumPostDetailResponse> getPostById(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(forumService.getPostById(authentication.getName(), id));
    }

    // POST /api/forum/posts
    @PostMapping("/posts")
    public ResponseEntity<ForumPostResponse> createPost(
            Authentication authentication,
            @Valid @RequestBody CreatePostRequest request
    ) {
        return ResponseEntity.ok(forumService.createPost(authentication.getName(), request));
    }

    // POST /api/forum/posts/{id}/comments
    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<ForumCommentResponse> addComment(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody CreateCommentRequest request
    ) {
        return ResponseEntity.ok(forumService.addComment(authentication.getName(), id, request));
    }

    // POST /api/forum/posts/{id}/like
    @PostMapping("/posts/{id}/like")
    public ResponseEntity<LikeResponse> toggleLike(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(forumService.toggleLike(authentication.getName(), id));
    }
}