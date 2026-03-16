package com.mentalhealth.platform.forum.service;

public interface ForumPostRiskAnalyzer {

    ForumPostRiskAnalysisResult analyze(String title, String content, String category);
}
