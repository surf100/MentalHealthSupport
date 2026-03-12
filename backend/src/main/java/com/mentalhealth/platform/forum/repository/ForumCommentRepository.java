package com.mentalhealth.platform.forum.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mentalhealth.platform.forum.entity.ForumComment;
import com.mentalhealth.platform.forum.entity.ForumPost;
import com.mentalhealth.platform.user.entity.User;

public interface ForumCommentRepository extends JpaRepository<ForumComment, Long> {

    List<ForumComment> findByPostOrderByCreatedAtAsc(ForumPost post);

    long countByPost(ForumPost post);

    long countByUser(User user);
}