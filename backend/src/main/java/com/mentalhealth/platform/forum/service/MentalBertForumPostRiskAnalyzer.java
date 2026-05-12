package com.mentalhealth.platform.forum.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mentalhealth.platform.forum.entity.ForumPostRiskLevel;

@Component
public class MentalBertForumPostRiskAnalyzer implements ForumPostRiskAnalyzer {

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final URI analyzeUri;

    public MentalBertForumPostRiskAnalyzer(
            ObjectMapper objectMapper,
            @Value("${ml.forum-risk.base-url:http://localhost:8001}") String baseUrl,
            @Value("${ml.forum-risk.analyze-path:/analyze}") String analyzePath,
            @Value("${ml.forum-risk.connect-timeout-ms:3000}") long connectTimeoutMs
    ) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMillis(connectTimeoutMs))
                .build();
        this.analyzeUri = URI.create(normalizeBaseUrl(baseUrl) + normalizePath(analyzePath));
    }

    @Override
    public ForumPostRiskAnalysisResult analyze(String title, String content, String category) {
        ObjectNode payload = objectMapper.createObjectNode();
        payload.put("title", title);
        payload.put("content", content);
        payload.put("category", category);

        try {
            HttpRequest request = HttpRequest.newBuilder(analyzeUri)
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException(
                        "AI moderation service returned HTTP " + response.statusCode() + ": " + response.body()
                );
            }

            JsonNode body = objectMapper.readTree(response.body());
            double sentimentScore = clampDouble(body.path("sentimentScore").asDouble(0.0), -1.0, 1.0);
            int riskScore = clamp(body.path("riskScore").asInt(0), 0, 100);
            ForumPostRiskLevel riskLevel = parseRiskLevel(body.path("riskLevel").asText("LOW"));
            boolean flaggedForReview = body.path("flaggedForReview").asBoolean(false);
            String summary = body.path("summary").asText("AI moderation analysis completed.");

            return new ForumPostRiskAnalysisResult(
                    sentimentScore,
                    riskScore,
                    riskLevel,
                    flaggedForReview,
                    summary
            );
        } catch (IOException ex) {
            throw new IllegalStateException("Could not read AI moderation service response", ex);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("AI moderation analysis request was interrupted", ex);
        }
    }

    private String normalizeBaseUrl(String baseUrl) {
        return baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
    }

    private String normalizePath(String path) {
        return path.startsWith("/") ? path : "/" + path;
    }

    private ForumPostRiskLevel parseRiskLevel(String raw) {
        try {
            return ForumPostRiskLevel.valueOf(raw.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            return ForumPostRiskLevel.LOW;
        }
    }

    private int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
    }

    private double clampDouble(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }
}
