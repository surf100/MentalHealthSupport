package com.mentalhealth.platform.report.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mentalhealth.platform.report.entity.ReportStatusHistory;

public interface ReportStatusHistoryRepository extends JpaRepository<ReportStatusHistory, Long> {

    List<ReportStatusHistory> findByReportIdOrderByOccurredAtAsc(Long reportId);
}