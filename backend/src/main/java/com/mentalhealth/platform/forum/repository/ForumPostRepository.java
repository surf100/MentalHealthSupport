package com.mentalhealth.platform.forum.repository;

import java.util.List;
import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mentalhealth.platform.forum.entity.ForumCategory;
import com.mentalhealth.platform.forum.entity.ForumPost;
import com.mentalhealth.platform.forum.entity.ForumPostModerationStatus;
import com.mentalhealth.platform.forum.entity.ForumPostRiskLevel;
import com.mentalhealth.platform.user.entity.User;

public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {

    List<ForumPost> findAllByOrderByCreatedAtDesc();

    List<ForumPost> findByCategoryOrderByCreatedAtDesc(ForumCategory category);

    List<ForumPost> findByFlaggedForReviewTrueOrderByRiskScoreDescCreatedAtDesc();

    List<ForumPost> findAllByOrderByFlaggedForReviewDescRiskScoreDescCreatedAtDesc();

    List<ForumPost> findByModerationStatusAndAnalyzedAtIsNullOrderByCreatedAtDesc(
            ForumPostModerationStatus moderationStatus
    );

    List<ForumPost> findByModerationStatusOrderByCreatedAtDesc(ForumPostModerationStatus moderationStatus);

    long countByUser(User user);

    long countByFlaggedForReviewTrue();

    long countByModerationStatus(ForumPostModerationStatus moderationStatus);

    long countByRiskLevelIn(Collection<ForumPostRiskLevel> riskLevels);
}
