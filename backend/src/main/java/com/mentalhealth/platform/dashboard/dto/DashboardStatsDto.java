package com.mentalhealth.platform.dashboard.dto;

public class DashboardStatsDto {

    private long reportsCount;
    private long notificationsCount;
    private long postsCount;
    private long achievementsCount;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long reportsCount, long notificationsCount, long postsCount, long achievementsCount) {
        this.reportsCount = reportsCount;
        this.notificationsCount = notificationsCount;
        this.postsCount = postsCount;
        this.achievementsCount = achievementsCount;
    }

    public long getReportsCount() {
        return reportsCount;
    }

    public long getNotificationsCount() {
        return notificationsCount;
    }

    public long getPostsCount() {
        return postsCount;
    }

    public long getAchievementsCount() {
        return achievementsCount;
    }

    public void setReportsCount(long reportsCount) {
        this.reportsCount = reportsCount;
    }

    public void setNotificationsCount(long notificationsCount) {
        this.notificationsCount = notificationsCount;
    }

    public void setPostsCount(long postsCount) {
        this.postsCount = postsCount;
    }

    public void setAchievementsCount(long achievementsCount) {
        this.achievementsCount = achievementsCount;
    }
}