package com.ssafy.project.service;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.record.BookParticipationRecord;
import com.ssafy.project.domain.record.SketchParticipationRecord;
import com.ssafy.project.domain.type.ParticipationMode;
import com.ssafy.project.dto.report.ActivityAnalysisDto;
import com.ssafy.project.dto.report.ActivityHistoryDto;
import com.ssafy.project.exception.NotFoundException;
import com.ssafy.project.repository.BookParticipationRecordRepository;
import com.ssafy.project.repository.BookRepository;
import com.ssafy.project.repository.ChildRepository;
import com.ssafy.project.repository.SketchParticipationRecordRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final BookParticipationRecordRepository bookParticipationRecordRepository;
    private final SketchParticipationRecordRepository sketchParticipationRecordRepository;
    private final ChildRepository childRepository;
    private final BookRepository bookRepository;

    //  독서 시간, 그린 시간, 평균 이용 시간(이번달, 이번주, 지난주), 중도 퇴장 횟수
    // + 싱글 모드 / 멀티 모드
    @Override
    public ActivityAnalysisDto activityAnalysis(Long childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new NotFoundException("해당 자식 사용자를 찾을 수 없습니다"));

        List<BookParticipationRecord> bookRecordList = bookParticipationRecordRepository.findAllByChild(child);
        List<SketchParticipationRecord> sketchRecordList = sketchParticipationRecordRepository.findAllByChild(child);

        long readingMinutes = 0, sketchingMinutes = 0;
        long thisMonthMinutes = 0, thisWeekMinutes = 0, lastWeekMinutes = 0;
        int earlyExitCount = 0, singleModeCount = 0, multiModeCount = 0;
        for (BookParticipationRecord bookRecord : bookRecordList) {
            // 중도 퇴장 횟수
            if (bookRecord.isEarlyExit()) earlyExitCount++;

            // 싱글 모드 / 멀티 모드 횟수
            if (bookRecord.getMode() == ParticipationMode.SINGLE) singleModeCount++;
            else multiModeCount++;

            // 독서 시간
            readingMinutes += Duration.between(bookRecord.getStartTime(), bookRecord.getEndTime()).toMinutes();
        }

        for (SketchParticipationRecord sketchRecord : sketchRecordList) {
            // 싱글 모드 / 멀티 모드 횟수
            if (sketchRecord.getMode() == ParticipationMode.SINGLE) singleModeCount++;
            else multiModeCount++;

            // 그린 시간
            sketchingMinutes += Duration.between(sketchRecord.getStartTime(), sketchRecord.getEndTime()).toMinutes();
        }

        LocalDateTime now = LocalDateTime.now();
        log.info("now={}", now);

        // 이번달 이용 시간
        LocalDateTime startOfMonth = now.withDayOfMonth(1).truncatedTo(ChronoUnit.DAYS);  // 이번달 1일
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusDays(1).truncatedTo(ChronoUnit.DAYS);  // 이번달 말일
        thisMonthMinutes += getTotalBetweenTime(childId, startOfMonth, endOfMonth);
        log.info("startOfMonth={}", startOfMonth);
        log.info("endOfMonth={}", endOfMonth);

        // 이번주 이용 시간
        LocalDateTime startOfWeek = now.with(DayOfWeek.MONDAY).truncatedTo(ChronoUnit.DAYS); // 이번주 시작일
        LocalDateTime endOfWeek = now.with(DayOfWeek.SUNDAY).truncatedTo(ChronoUnit.DAYS); // 이번주 종료일
        thisWeekMinutes += getTotalBetweenTime(childId, startOfWeek, endOfWeek);
        log.info("startOfWeek={}", startOfWeek);
        log.info("endOfWeek={}", endOfWeek);

        // 저번주 이용 시간
        LocalDateTime startOfLastWeek = startOfWeek.minusWeeks(1);
        LocalDateTime endOfLastWeek = endOfWeek.minusWeeks(1);
        log.info("startOfLastWeek={}", startOfLastWeek);
        log.info("endOfLastWeek={}", endOfLastWeek);

        lastWeekMinutes += getTotalBetweenTime(childId, startOfLastWeek, endOfLastWeek);

        return ActivityAnalysisDto.builder()
                .readingMinutes(readingMinutes)
                .sketchingMinutes(sketchingMinutes)
                .thisMonthMinutes(thisMonthMinutes)
                .thisWeekMinutes(thisWeekMinutes)
                .lastWeekMinutes(lastWeekMinutes)
                .earlyExitCount(earlyExitCount)
                .singleModeCount(singleModeCount)
                .multiModeCount(multiModeCount)
                .build();
    }

    public Long getTotalBetweenTime(Long childId, LocalDateTime start, LocalDateTime end) {
        return bookParticipationRecordRepository.totalBetweenTime(childId, start, end)
                + sketchParticipationRecordRepository.totalBetweenTime(childId, start, end);
    }

    // 활동 내역 (많이 읽은 책 3개 & 읽은 횟수)
    @Override
    public List<ActivityHistoryDto> activityHistory(Long childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new NotFoundException("해당 자식 사용자를 찾을 수 없습니다"));

        return bookParticipationRecordRepository.mostReadBooks(child.getId());
    }
}
