package com.mentalhealth.platform.forum.service;

import com.mentalhealth.platform.forum.entity.ForumPostRiskLevel;

public class ForumPostRiskAnalysisResult {

    private final double sentimentScore;
    private final int riskScore;
    private final ForumPostRiskLevel riskLevel;
    private final boolean flaggedForReview;
    private final String summary;

    public ForumPostRiskAnalysisResult(
            double sentimentScore,
            int riskScore,
            ForumPostRiskLevel riskLevel,
            boolean flaggedForReview,
            String summary
    ) {
        this.sentimentScore = sentimentScore;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.flaggedForReview = flaggedForReview;
        this.summary = summary;
    }

    public double getSentimentScore() {
        return sentimentScore;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public ForumPostRiskLevel getRiskLevel() {
        return riskLevel;
    }

    public boolean isFlaggedForReview() {
        return flaggedForReview;
    }

    public String getSummary() {
        return summary;
    }
}
