package com.mentalhealth.platform.forum.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mentalhealth.platform.forum.entity.ForumCategory;
import com.mentalhealth.platform.forum.entity.ForumPost;
import com.mentalhealth.platform.user.entity.User;

public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {

    List<ForumPost> findAllByOrderByCreatedAtDesc();

    List<ForumPost> findByCategoryOrderByCreatedAtDesc(ForumCategory category);

    long countByUser(User user);
}