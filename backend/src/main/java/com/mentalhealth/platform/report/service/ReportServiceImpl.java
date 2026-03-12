package com.mentalhealth.platform.report.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentalhealth.platform.common.exception.BadRequestException;
import com.mentalhealth.platform.report.dto.CreateReportRequest;
import com.mentalhealth.platform.report.dto.ReportDetailResponse;
import com.mentalhealth.platform.report.dto.ReportResponse;
import com.mentalhealth.platform.report.dto.TimelineItemResponse;
import com.mentalhealth.platform.report.entity.Report;
import com.mentalhealth.platform.report.entity.ReportStatus;
import com.mentalhealth.platform.report.entity.ReportStatusHistory;
import com.mentalhealth.platform.report.repository.ReportRepository;
import com.mentalhealth.platform.report.repository.ReportStatusHistoryRepository;
import com.mentalhealth.platform.user.entity.User;
import com.mentalhealth.platform.user.repository.UserRepository;

@Service
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final ReportStatusHistoryRepository historyRepository;
    private final UserRepository userRepository;

    public ReportServiceImpl(
            ReportRepository reportRepository,
            ReportStatusHistoryRepository historyRepository,
            UserRepository userRepository
    ) {
        this.reportRepository = reportRepository;
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public ReportResponse createReport(String email, CreateReportRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Report report = new Report();
        report.setUser(user);
        report.setTitle(request.getTitle());
        report.setDescription(request.getDescription());
        report.setCategory(request.getCategory());
        report.setAnonymous(request.getIsAnonymous());

        Report saved = reportRepository.save(report);

        // Auto-create first timeline entry on submission
        ReportStatusHistory initial = new ReportStatusHistory(
                saved,
                ReportStatus.SUBMITTED,
                "Report submitted",
                "Your report was successfully received by the platform."
        );
        historyRepository.save(initial);

        return ReportResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportResponse> getMyReports(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        return reportRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(ReportResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReportDetailResponse getReportById(String email, Long reportId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new BadRequestException("Report not found"));

        // Users can only access their own reports
        if (!report.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Report not found");
        }

        List<TimelineItemResponse> timeline = historyRepository
                .findByReportIdOrderByOccurredAtAsc(reportId)
                .stream()
                .map(TimelineItemResponse::from)
                .toList();

        return ReportDetailResponse.from(report, timeline);
    }
}