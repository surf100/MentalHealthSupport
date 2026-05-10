package com.mentalhealth.platform.achievement.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentalhealth.platform.achievement.dto.AchievementResponse;
import com.mentalhealth.platform.common.exception.BadRequestException;
import com.mentalhealth.platform.forum.repository.ForumCommentRepository;
import com.mentalhealth.platform.forum.repository.ForumPostLikeRepository;
import com.mentalhealth.platform.forum.repository.ForumPostRepository;
import com.mentalhealth.platform.notification.entity.Notification;
import com.mentalhealth.platform.notification.entity.NotificationType;
import com.mentalhealth.platform.notification.repository.NotificationRepository;
import com.mentalhealth.platform.report.repository.ReportRepository;
import com.mentalhealth.platform.user.entity.User;
import com.mentalhealth.platform.user.repository.UserRepository;

@Service
public class AchievementServiceImpl implements AchievementService {

    private final UserRepository userRepository;
    private final ForumPostRepository postRepository;
    private final ForumCommentRepository commentRepository;
    private final ForumPostLikeRepository likeRepository;
    private final ReportRepository reportRepository;
    private final NotificationRepository notificationRepository;

    public AchievementServiceImpl(
            UserRepository userRepository,
            ForumPostRepository postRepository,
            ForumCommentRepository commentRepository,
            ForumPostLikeRepository likeRepository,
            ReportRepository reportRepository,
            NotificationRepository notificationRepository
    ) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
        this.reportRepository = reportRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    @Transactional
    public List<AchievementResponse> getAchievements(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        long posts    = postRepository.countByUser(user);
        long comments = commentRepository.countByUser(user);
        long reports  = reportRepository.countByUser(user);
        long likes    = likeRepository.countByUser(user);
        long accountAgeDays = ChronoUnit.DAYS.between(user.getCreatedAt(), LocalDateTime.now());

        List<AchievementResponse> achievements = List.of(

            // ── Forum: posts ─────────────────────────────────────────────────
            ach("FIRST_VOICE",          posts >= 1),
            ach("RISING_VOICE",         posts >= 5),
            ach("ACTIVE_VOICE",         posts >= 10),
            ach("FORUM_REGULAR",        posts >= 25),
            ach("PROLIFIC_POSTER",      posts >= 50),

            // ── Forum: comments ──────────────────────────────────────────────
            ach("FIRST_REPLY",          comments >= 1),
            ach("SUPPORTIVE_FRIEND",    comments >= 5),
            ach("COMMUNITY_HELPER",     comments >= 10),
            ach("COMMUNITY_CHAMPION",   comments >= 25),
            ach("REPLY_MASTER",         comments >= 50),
            ach("COMMENT_LEGEND",       comments >= 100),

            // ── Forum: combined posts + comments ─────────────────────────────
            ach("TRUSTED_MEMBER",       (posts + comments) >= 5),
            ach("DEDICATED_MEMBER",     (posts + comments) >= 20),
            ach("PLATFORM_PILLAR",      (posts + comments) >= 50),
            ach("COMMUNITY_LEGEND",     (posts + comments) >= 100),

            // ── Likes given ──────────────────────────────────────────────────
            ach("FIRST_LIKE",           likes >= 1),
            ach("SPREADING_SUPPORT",    likes >= 10),
            ach("LIKE_ENTHUSIAST",      likes >= 25),
            ach("POSITIVITY_ENGINE",    likes >= 50),

            // ── Reports ───────────────────────────────────────────────────────
            ach("SAFETY_ADVOCATE",      reports >= 1),
            ach("GUARDIAN",             reports >= 3),
            ach("COMMUNITY_GUARDIAN",   reports >= 10),

            // ── Account age ───────────────────────────────────────────────────
            ach("NEWCOMER",             accountAgeDays >= 1),
            ach("ONE_WEEK_STRONG",      accountAgeDays >= 7),
            ach("ONE_MONTH_MEMBER",     accountAgeDays >= 30),
            ach("QUARTER_YEAR",         accountAgeDays >= 90),
            ach("HALF_YEAR",            accountAgeDays >= 180),
            ach("ONE_YEAR_ANNIVERSARY", accountAgeDays >= 365),

            // ── Profile completeness ─────────────────────────────────────────
            ach("PROFILE_STARTER",      user.getNickname() != null && !user.getNickname().isBlank()),

            // ── Combo achievements ────────────────────────────────────────────
            ach("FULLY_PRESENT",        posts >= 1 && comments >= 1 && reports >= 1),
            ach("TRIPLE_THREAT",        posts >= 5 && comments >= 5 && reports >= 1),
            ach("ALL_ROUNDER",          posts >= 10 && comments >= 10 && reports >= 3 && likes >= 10),
            ach("SUPER_CONTRIBUTOR",    posts >= 25 && comments >= 25),
            ach("TOP_CONTRIBUTOR",      posts >= 50 && comments >= 50),
            ach("CONVERSATION_STARTER", posts >= 3 && comments >= 3),
            ach("VOICE_OF_REASON",      posts >= 10 && comments >= 20)
        );

        // Send notification for each newly earned achievement (no duplicates)
        Set<String> alreadyNotified = notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(Notification::getTitle)
                .collect(Collectors.toSet());

        List<Notification> toSave = new ArrayList<>();
        for (AchievementResponse a : achievements) {
            if (!a.isEarned()) continue;
            String title = "Achievement unlocked: " + displayTitle(a.getId());
            if (alreadyNotified.contains(title)) continue;

            Notification n = new Notification();
            n.setUser(user);
            n.setType(NotificationType.ACHIEVEMENT);
            n.setTitle(title);
            n.setMessage(achievementMessage(a.getId()));
            toSave.add(n);
        }
        if (!toSave.isEmpty()) notificationRepository.saveAll(toSave);

        return achievements;
    }

    private AchievementResponse ach(String id, boolean earned) {
        return new AchievementResponse(id, earned, earned ? LocalDateTime.now() : null);
    }

    private String displayTitle(String id) {
        return switch (id) {
            case "FIRST_VOICE"          -> "First Voice";
            case "RISING_VOICE"         -> "Rising Voice";
            case "ACTIVE_VOICE"         -> "Active Voice";
            case "FORUM_REGULAR"        -> "Forum Regular";
            case "PROLIFIC_POSTER"      -> "Prolific Poster";
            case "FIRST_REPLY"          -> "First Reply";
            case "SUPPORTIVE_FRIEND"    -> "Supportive Friend";
            case "COMMUNITY_HELPER"     -> "Community Helper";
            case "COMMUNITY_CHAMPION"   -> "Community Champion";
            case "REPLY_MASTER"         -> "Reply Master";
            case "COMMENT_LEGEND"       -> "Comment Legend";
            case "TRUSTED_MEMBER"       -> "Trusted Member";
            case "DEDICATED_MEMBER"     -> "Dedicated Member";
            case "PLATFORM_PILLAR"      -> "Platform Pillar";
            case "COMMUNITY_LEGEND"     -> "Community Legend";
            case "FIRST_LIKE"           -> "First Like";
            case "SPREADING_SUPPORT"    -> "Spreading Support";
            case "LIKE_ENTHUSIAST"      -> "Like Enthusiast";
            case "POSITIVITY_ENGINE"    -> "Positivity Engine";
            case "SAFETY_ADVOCATE"      -> "Safety Advocate";
            case "GUARDIAN"             -> "Guardian";
            case "COMMUNITY_GUARDIAN"   -> "Community Guardian";
            case "NEWCOMER"             -> "Newcomer";
            case "ONE_WEEK_STRONG"      -> "One Week Strong";
            case "ONE_MONTH_MEMBER"     -> "One Month Member";
            case "QUARTER_YEAR"         -> "Quarter Year";
            case "HALF_YEAR"            -> "Half Year";
            case "ONE_YEAR_ANNIVERSARY" -> "One Year Anniversary";
            case "PROFILE_STARTER"      -> "Profile Starter";
            case "FULLY_PRESENT"        -> "Fully Present";
            case "TRIPLE_THREAT"        -> "Triple Threat";
            case "ALL_ROUNDER"          -> "All-Rounder";
            case "SUPER_CONTRIBUTOR"    -> "Super Contributor";
            case "TOP_CONTRIBUTOR"      -> "Top Contributor";
            case "CONVERSATION_STARTER" -> "Conversation Starter";
            case "VOICE_OF_REASON"      -> "Voice of Reason";
            default -> id;
        };
    }

    private String achievementMessage(String id) {
        return switch (id) {
            case "FIRST_VOICE"          -> "You published your first forum post. Welcome to the community!";
            case "RISING_VOICE"         -> "You've published 5 forum posts. Your voice is growing!";
            case "ACTIVE_VOICE"         -> "10 posts published. You're an active member of the forum!";
            case "FORUM_REGULAR"        -> "25 posts — you're a true forum regular. Keep it up!";
            case "PROLIFIC_POSTER"      -> "50 posts! Your contributions shape this community.";
            case "FIRST_REPLY"          -> "You left your first comment. Thank you for supporting others!";
            case "SUPPORTIVE_FRIEND"    -> "5 comments posted. You're making a difference!";
            case "COMMUNITY_HELPER"     -> "10 comments — you actively support other members!";
            case "COMMUNITY_CHAMPION"   -> "25 comments. You are a true community champion!";
            case "REPLY_MASTER"         -> "50 comments posted. You're a reply master!";
            case "COMMENT_LEGEND"       -> "100 comments — a legendary contributor!";
            case "TRUSTED_MEMBER"       -> "5 combined contributions. The community trusts you!";
            case "DEDICATED_MEMBER"     -> "20 combined contributions. Your dedication shows!";
            case "PLATFORM_PILLAR"      -> "50 contributions — you're a pillar of this platform!";
            case "COMMUNITY_LEGEND"     -> "100 contributions. A true legend of the community!";
            case "FIRST_LIKE"           -> "You liked your first post. Spread the positivity!";
            case "SPREADING_SUPPORT"    -> "10 likes given. You support others generously!";
            case "LIKE_ENTHUSIAST"      -> "25 likes given — you're an enthusiast of positivity!";
            case "POSITIVITY_ENGINE"    -> "50 likes given. You fuel this community with positivity!";
            case "SAFETY_ADVOCATE"      -> "You submitted your first report. You help keep this space safe.";
            case "GUARDIAN"             -> "3 reports submitted. You are a guardian of this community!";
            case "COMMUNITY_GUARDIAN"   -> "10 reports — a dedicated guardian of community safety!";
            case "NEWCOMER"             -> "Welcome! Your journey on this platform has begun.";
            case "ONE_WEEK_STRONG"      -> "You've been a member for 7 days. Great start!";
            case "ONE_MONTH_MEMBER"     -> "One month as a member — you're here to stay!";
            case "QUARTER_YEAR"         -> "3 months on the platform. A committed member!";
            case "HALF_YEAR"            -> "6 months — halfway to your first anniversary!";
            case "ONE_YEAR_ANNIVERSARY" -> "One full year on the platform. Happy anniversary!";
            case "PROFILE_STARTER"      -> "Your profile is set up and ready to go!";
            case "FULLY_PRESENT"        -> "You've posted, commented, and reported. Fully engaged!";
            case "TRIPLE_THREAT"        -> "Active in posts, comments, and safety reports — triple threat!";
            case "ALL_ROUNDER"          -> "Mastery across all areas of the platform!";
            case "SUPER_CONTRIBUTOR"    -> "25+ posts and comments — a super contributor!";
            case "TOP_CONTRIBUTOR"      -> "50+ posts and 50+ comments. The top of the top!";
            case "CONVERSATION_STARTER" -> "You start and join conversations with ease!";
            case "VOICE_OF_REASON"      -> "10 posts and 20 comments — a voice of reason in the community.";
            default -> "You earned a new achievement!";
        };
    }
}