package com.mentalhealth.platform.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mentalhealth.platform.achievement.service.AchievementService;
import com.mentalhealth.platform.common.exception.ResourceNotFoundException;
import com.mentalhealth.platform.dashboard.dto.DashboardActivityDto;
import com.mentalhealth.platform.dashboard.dto.DashboardProfileDto;
import com.mentalhealth.platform.dashboard.dto.DashboardResponse;
import com.mentalhealth.platform.dashboard.dto.DashboardStatsDto;
import com.mentalhealth.platform.notification.entity.Notification;
import com.mentalhealth.platform.notification.repository.NotificationRepository;
import com.mentalhealth.platform.profile.entity.Profile;
import com.mentalhealth.platform.profile.repository.ProfileRepository;
import com.mentalhealth.platform.report.repository.ReportRepository;
import com.mentalhealth.platform.user.entity.User;
import com.mentalhealth.platform.user.repository.UserRepository;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ProfileRepository profileRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final AchievementService achievementService;

    public DashboardServiceImpl(
            ProfileRepository profileRepository,
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            ReportRepository reportRepository,
            AchievementService achievementService) {

        this.profileRepository = profileRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
        this.achievementService = achievementService;
    }

    @Override
    public DashboardResponse getDashboardForCurrentUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Profile profile = profileRepository.findByUser(user)
                .orElseGet(() -> {
                    Profile newProfile = new Profile();
                    newProfile.setUser(user);
                    newProfile.setDisplayName(user.getNickname());
                    return profileRepository.save(newProfile);
                });

        long notificationsCount = notificationRepository.countByUser(user);

        List<Notification> recentNotifications =
                notificationRepository.findTop5ByUserOrderByCreatedAtDesc(user);

        DashboardProfileDto profileDto = new DashboardProfileDto(
                profile.getId(),
                profile.getDisplayName(),
                profile.getUser().getEmail(),
                profile.getAvatarUrl(),
                profile.getCreatedAt()
        );

        long reportsCount = reportRepository.countByUser(user);
        long achievementsCount = achievementService.getAchievements(email)
                .stream().filter(a -> a.isEarned()).count();

        DashboardStatsDto statsDto = new DashboardStatsDto(
                reportsCount,
                notificationsCount,
                0,
                achievementsCount
        );

        String welcomeName = profile.getDisplayName() != null && !profile.getDisplayName().isBlank()
                ? profile.getDisplayName()
                : user.getNickname();

        List<DashboardActivityDto> recentActivity = recentNotifications.stream()
                .map(this::mapNotificationToActivity)
                .toList();

        return new DashboardResponse(
                welcomeName,
                profileDto,
                statsDto,
                recentActivity
        );
    }

    private DashboardActivityDto mapNotificationToActivity(Notification notification) {
        return new DashboardActivityDto(
                notification.getType().name(),
                notification.getTitle(),
                notification.getMessage(),
                formatTimestampLabel(notification.getCreatedAt()),
                notification.getCreatedAt()
        );
    }

    private String formatTimestampLabel(java.time.LocalDateTime createdAt) {

        java.time.Duration duration =
                java.time.Duration.between(createdAt, java.time.LocalDateTime.now());

        long minutes = duration.toMinutes();
        long hours = duration.toHours();
        long days = duration.toDays();

        if (minutes < 1) {
            return "Just now";
        }
        if (minutes < 60) {
            return minutes + (minutes == 1 ? " minute ago" : " minutes ago");
        }
        if (hours < 24) {
            return hours + (hours == 1 ? " hour ago" : " hours ago");
        }
        if (days == 1) {
            return "Yesterday";
        }
        if (days < 7) {
            return days + " days ago";
        }

        return createdAt.toLocalDate().toString();
    }
}