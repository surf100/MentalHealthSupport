package com.mentalhealth.platform.dashboard.dto;

import java.util.List;

public class DashboardResponse {

    private String welcomeName;
    private DashboardProfileDto profile;
    private DashboardStatsDto stats;
    private List<DashboardActivityDto> recentActivity;

    public DashboardResponse() {
    }

    public DashboardResponse(String welcomeName,
                             DashboardProfileDto profile,
                             DashboardStatsDto stats,
                             List<DashboardActivityDto> recentActivity) {
        this.welcomeName = welcomeName;
        this.profile = profile;
        this.stats = stats;
        this.recentActivity = recentActivity;
    }

    public String getWelcomeName() {
        return welcomeName;
    }

    public DashboardProfileDto getProfile() {
        return profile;
    }

    public DashboardStatsDto getStats() {
        return stats;
    }

    public List<DashboardActivityDto> getRecentActivity() {
        return recentActivity;
    }

    public void setWelcomeName(String welcomeName) {
        this.welcomeName = welcomeName;
    }

    public void setProfile(DashboardProfileDto profile) {
        this.profile = profile;
    }

    public void setStats(DashboardStatsDto stats) {
        this.stats = stats;
    }

    public void setRecentActivity(List<DashboardActivityDto> recentActivity) {
        this.recentActivity = recentActivity;
    }
}