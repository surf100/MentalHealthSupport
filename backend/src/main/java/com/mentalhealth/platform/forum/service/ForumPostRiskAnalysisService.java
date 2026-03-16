package com.mentalhealth.platform.forum.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.mentalhealth.platform.forum.entity.ForumPost;
import com.mentalhealth.platform.forum.entity.ForumPostModerationStatus;
import com.mentalhealth.platform.forum.event.ForumPostCreatedEvent;
import com.mentalhealth.platform.forum.repository.ForumPostRepository;
import com.mentalhealth.platform.notification.entity.Notification;
import com.mentalhealth.platform.notification.entity.NotificationType;
import com.mentalhealth.platform.notification.repository.NotificationRepository;
import com.mentalhealth.platform.user.entity.User;
import com.mentalhealth.platform.user.enums.UserRole;
import com.mentalhealth.platform.user.repository.UserRepository;

@Service
public class ForumPostRiskAnalysisService {

    private final ForumPostRepository forumPostRepository;
    private final ForumPostRiskAnalyzer forumPostRiskAnalyzer;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public ForumPostRiskAnalysisService(
            ForumPostRepository forumPostRepository,
            ForumPostRiskAnalyzer forumPostRiskAnalyzer,
            UserRepository userRepository,
            NotificationRepository notificationRepository
    ) {
        this.forumPostRepository = forumPostRepository;
        this.forumPostRiskAnalyzer = forumPostRiskAnalyzer;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void analyzePostAsync(ForumPostCreatedEvent event) {
        forumPostRepository.findById(event.getPostId()).ifPresent(post -> {
            try {
                ForumPostRiskAnalysisResult result = forumPostRiskAnalyzer.analyze(
                        post.getTitle(),
                        post.getContent(),
                        post.getCategory().name()
                );

                post.setSentimentScore(result.getSentimentScore());
                post.setRiskScore(result.getRiskScore());
                post.setRiskLevel(result.getRiskLevel());
                post.setFlaggedForReview(result.isFlaggedForReview());
                post.setRiskSummary(result.getSummary());
                post.setAnalyzedAt(LocalDateTime.now());
                post.setModerationNotes("Analyzed with external AI model.");
                post.setModerationStatus(
                        result.isFlaggedForReview()
                                ? ForumPostModerationStatus.FLAGGED
                                : ForumPostModerationStatus.CLEAR
                );

                forumPostRepository.save(post);

                if (result.isFlaggedForReview()) {
                    notifyAdmins(post);
                }
            } catch (RuntimeException ex) {
                post.setAnalyzedAt(LocalDateTime.now());
                post.setFlaggedForReview(false);
                post.setModerationStatus(ForumPostModerationStatus.ANALYSIS_FAILED);
                post.setModerationNotes("MentalBERT analysis failed: " + ex.getMessage());
                forumPostRepository.save(post);
            }
        });
    }

    private void notifyAdmins(ForumPost post) {
        List<User> admins = userRepository.findByRole(UserRole.ADMIN);

        for (User admin : admins) {
            Notification notification = new Notification();
            notification.setUser(admin);
            notification.setType(NotificationType.WARNING);
            notification.setTitle("High-risk forum post flagged");
            notification.setMessage(
                    "Post #" + post.getId()
                            + " scored " + post.getRiskScore()
                            + "/100 and requires moderation review."
            );
            notificationRepository.save(notification);
        }
    }
}
