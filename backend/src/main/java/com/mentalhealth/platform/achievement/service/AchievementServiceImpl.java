package com.mentalhealth.platform.achievement.service;

import com.mentalhealth.platform.achievement.dto.AchievementResponse;
import com.mentalhealth.platform.common.exception.BadRequestException;
import com.mentalhealth.platform.forum.repository.ForumCommentRepository;
import com.mentalhealth.platform.forum.repository.ForumPostRepository;
import com.mentalhealth.platform.report.repository.ReportRepository;
import com.mentalhealth.platform.user.entity.User;
import com.mentalhealth.platform.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AchievementServiceImpl implements AchievementService {

    private final UserRepository userRepository;
    private final ForumPostRepository postRepository;
    private final ForumCommentRepository commentRepository;
    private final ReportRepository reportRepository;

    public AchievementServiceImpl(
            UserRepository userRepository,
            ForumPostRepository postRepository,
            ForumCommentRepository commentRepository,
            ReportRepository reportRepository
    ) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.reportRepository = reportRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AchievementResponse> getAchievements(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        long postCount    = postRepository.countByUser(user);
        long commentCount = commentRepository.countByUser(user);
        long reportCount  = reportRepository.countByUser(user);

        // First Voice — 1+ posts
        boolean firstVoice = postCount >= 1;

        // Community Helper — 1+ comments
        boolean communityHelper = commentCount >= 1;

        // Safety Advocate — 1+ reports
        boolean safetyAdvocate = reportCount >= 1;

        // Trusted Member — 5+ posts OR comments combined
        boolean trustedMember = (postCount + commentCount) >= 5;

        // Community Champion — 10+ comments
        boolean communityChampion = commentCount >= 10;

        // Top Contributor — 10+ posts
        boolean topContributor = postCount >= 10;

        // earnedAt: use user.createdAt as fallback — exact per-action timestamps
        // would require a dedicated achievements table, which is out of scope for MVP
        var createdAt = user.getCreatedAt();

        return List.of(
                new AchievementResponse("FIRST_VOICE",        firstVoice,        firstVoice        ? createdAt : null),
                new AchievementResponse("COMMUNITY_HELPER",   communityHelper,   communityHelper   ? createdAt : null),
                new AchievementResponse("SAFETY_ADVOCATE",    safetyAdvocate,    safetyAdvocate    ? createdAt : null),
                new AchievementResponse("TRUSTED_MEMBER",     trustedMember,     trustedMember     ? createdAt : null),
                new AchievementResponse("COMMUNITY_CHAMPION", communityChampion, communityChampion ? createdAt : null),
                new AchievementResponse("TOP_CONTRIBUTOR",    topContributor,    topContributor    ? createdAt : null)
        );
    }
}