package com.mentalhealth.platform.forum.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mentalhealth.platform.forum.entity.ForumPost;
import com.mentalhealth.platform.forum.entity.ForumPostLike;
import com.mentalhealth.platform.user.entity.User;

public interface ForumPostLikeRepository extends JpaRepository<ForumPostLike, Long> {

    Optional<ForumPostLike> findByPostAndUser(ForumPost post, User user);

    long countByPost(ForumPost post);

    boolean existsByPostAndUser(ForumPost post, User user);
}