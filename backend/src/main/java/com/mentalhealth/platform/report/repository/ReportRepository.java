package com.mentalhealth.platform.report.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mentalhealth.platform.forum.entity.ForumPostModerationStatus;
import com.mentalhealth.platform.report.entity.Report;
import com.mentalhealth.platform.user.entity.User;

public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByUserOrderByCreatedAtDesc(User user);

    List<Report> findAllByOrderByFlaggedForReviewDescRiskScoreDescCreatedAtDesc();

    List<Report> findByModerationStatusAndAnalyzedAtIsNullOrderByCreatedAtDesc(ForumPostModerationStatus moderationStatus);

    List<Report> findByModerationStatusOrderByCreatedAtDesc(ForumPostModerationStatus moderationStatus);

    long countByUser(User user);
}
