package com.mentalhealth.platform.forum.service;

import com.mentalhealth.platform.common.exception.BadRequestException;
import com.mentalhealth.platform.forum.dto.*;
import com.mentalhealth.platform.forum.entity.*;
import com.mentalhealth.platform.forum.event.ForumPostCreatedEvent;
import com.mentalhealth.platform.forum.repository.*;
import com.mentalhealth.platform.user.entity.User;
import com.mentalhealth.platform.user.repository.UserRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ForumServiceImpl implements ForumService {

    private final ForumPostRepository postRepository;
    private final ForumCommentRepository commentRepository;
    private final ForumPostLikeRepository likeRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public ForumServiceImpl(
            ForumPostRepository postRepository,
            ForumCommentRepository commentRepository,
            ForumPostLikeRepository likeRepository,
            UserRepository userRepository,
            ApplicationEventPublisher eventPublisher
    ) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ForumPostResponse> getPosts(String email, ForumCategory category) {
        User user = getUserByEmail(email);

        List<ForumPost> posts = category != null
                ? postRepository.findByCategoryOrderByCreatedAtDesc(category)
                : postRepository.findAllByOrderByCreatedAtDesc();

        return posts.stream()
                .map(post -> {
                    long commentCount = commentRepository.countByPost(post);
                    long likeCount = likeRepository.countByPost(post);
                    boolean likedByMe = likeRepository.existsByPostAndUser(post, user);
                    return ForumPostResponse.from(post, commentCount, likeCount, likedByMe);
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ForumPostDetailResponse getPostById(String email, Long postId) {
        User user = getUserByEmail(email);
        ForumPost post = getPostOrThrow(postId);

        long likeCount = likeRepository.countByPost(post);
        boolean likedByMe = likeRepository.existsByPostAndUser(post, user);

        List<ForumCommentResponse> comments = commentRepository
                .findByPostOrderByCreatedAtAsc(post)
                .stream()
                .map(ForumCommentResponse::from)
                .toList();

        return ForumPostDetailResponse.from(post, likeCount, likedByMe, comments);
    }

    @Override
    @Transactional
    public ForumPostResponse createPost(String email, CreatePostRequest request) {
        User user = getUserByEmail(email);

        ForumPost post = new ForumPost();
        post.setUser(user);
        post.setTitle(request.getTitle().trim());
        post.setContent(request.getContent().trim());
        post.setCategory(request.getCategory());
        post.setAnonymous(request.isAnonymous());
        post.setModerationStatus(ForumPostModerationStatus.PENDING_ANALYSIS);

        ForumPost saved = postRepository.save(post);
        eventPublisher.publishEvent(new ForumPostCreatedEvent(saved.getId()));
        return ForumPostResponse.from(saved, 0, 0, false);
    }

    @Override
    @Transactional
    public ForumCommentResponse addComment(String email, Long postId, CreateCommentRequest request) {
        User user = getUserByEmail(email);
        ForumPost post = getPostOrThrow(postId);

        ForumComment comment = new ForumComment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(request.getContent().trim());
        comment.setAnonymous(request.isAnonymous());

        return ForumCommentResponse.from(commentRepository.save(comment));
    }

    @Override
    @Transactional
    public LikeResponse toggleLike(String email, Long postId) {
        User user = getUserByEmail(email);
        ForumPost post = getPostOrThrow(postId);

        Optional<ForumPostLike> existing = likeRepository.findByPostAndUser(post, user);

        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            long count = likeRepository.countByPost(post);
            return new LikeResponse(false, count);
        } else {
            likeRepository.save(new ForumPostLike(post, user));
            long count = likeRepository.countByPost(post);
            return new LikeResponse(true, count);
        }
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    private ForumPost getPostOrThrow(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new BadRequestException("Post not found"));
    }
}
