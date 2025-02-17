package com.ssafy.project.service;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.record.BookRecord;
import com.ssafy.project.domain.record.SketchParticipationRecord;
import com.ssafy.project.domain.type.ParticipationMode;
import com.ssafy.project.dto.report.ActivityAnalysisDto;
import com.ssafy.project.dto.report.ActivityHistoryDto;
import com.ssafy.project.exception.NotFoundException;
import com.ssafy.project.repository.BookRecordRepository;
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
    private final BookRecordRepository bookParticipationRecordRepository;
    private final SketchParticipationRecordRepository sketchParticipationRecordRepository;
    private final ChildRepository childRepository;

    //  독서 시간, 그린 시간, 평균 이용 시간(이번달, 이번주, 지난주), 중도 퇴장 횟수
    // + 싱글 모드 / 멀티 모드
    @Override
    public ActivityAnalysisDto activityAnalysis(Long childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new NotFoundException("해당 자식 사용자를 찾을 수 없습니다"));

        LocalDateTime now = LocalDateTime.now();
        log.info("now={}", now);

        long readingMinutesSingle = 0, readingMinutesMulti = 0; // 이번주 독서 시간 (싱글, 멀티)
        long sketchingMinutesSingle = 0, sketchingMinutesMulti = 0; // 이번주 그린 시간 (싱글, 멀티)
        long thisMonthMinutes = 0, thisWeekMinutes = 0, lastWeekMinutes = 0; // 이번달, 이번주, 저번주 총 활동 시간
        int earlyExitCount = 0; // 증도 퇴장 횟수

        // 이번주
        LocalDateTime startOfWeek = now.with(DayOfWeek.MONDAY).truncatedTo(ChronoUnit.DAYS); // 이번주 시작일
        LocalDateTime endOfWeek = now.with(DayOfWeek.SUNDAY).truncatedTo(ChronoUnit.DAYS).plusDays(1); // 이번주 종료일
        log.info("startOfWeek={}", startOfWeek);
        log.info("endOfWeek={}", endOfWeek);

        List<BookRecord> bookRecordList = bookParticipationRecordRepository.findBookRecordByPeriod(child, startOfWeek, endOfWeek);
        for (BookRecord bookRecord : bookRecordList) {
            // 멀티 플레이 중 중도 퇴장 횟수 세기 (중도 퇴장했다면 참여 시간 기록 X)
            if (bookRecord.isEarlyExit()) {
                if (bookRecord.getMode() == ParticipationMode.MULTI) earlyExitCount++;
                continue;
            }

            LocalDateTime startTime = bookRecord.getStartTime();
            LocalDateTime endTime = bookRecord.getEndTime();

            // 종료 시간 없음 or 종료 시간이 시작 시간보다 더 빠른 상황 (비정상적인 상황)
            if (startTime == null || endTime == null || endTime.isBefore(startTime)) {
                continue;
            }

            // 참여 시간 더하기
            long minutes = Duration.between(startTime, endTime).toMinutes();
            thisWeekMinutes += minutes; // 이번주
            if (bookRecord.getMode() == ParticipationMode.SINGLE) { // 싱글 모드
                readingMinutesSingle += minutes;
            } else { // 멀티 모드
                readingMinutesMulti += minutes;
            }
        }

        List<SketchParticipationRecord> sketchRecordList = sketchParticipationRecordRepository.findSketchRecordByPeriod(child, startOfWeek, endOfWeek);
        for (SketchParticipationRecord sketchRecord : sketchRecordList) {
            // 멀티 플레이 중 중도 퇴장 횟수 세기 (중도 퇴장했다면 참여 시간 기록 X)
            if (sketchRecord.isEarlyExit()) {
                if (sketchRecord.getMode() == ParticipationMode.MULTI) earlyExitCount++;
                continue;
            }

            LocalDateTime startTime = sketchRecord.getStartTime();
            LocalDateTime endTime = sketchRecord.getEndTime();

            // 종료 시간 없음 or 종료 시간이 시작 시간보다 더 빠른 상황 (비정상적인 상황)
            if (startTime == null || endTime == null || endTime.isBefore(startTime)) {
                continue;
            }

            // 참여 시간 더하기
            long minutes = Duration.between(startTime, endTime).toMinutes();
            thisWeekMinutes += minutes; // 이번주
            if (sketchRecord.getMode() == ParticipationMode.SINGLE) { // 싱글 모드
                sketchingMinutesSingle += minutes;
            } else { // 멀티 모드
                sketchingMinutesMulti += minutes;
            }
        }

        // 저번주
        LocalDateTime startOfLastWeek = startOfWeek.minusWeeks(1);
        LocalDateTime endOfLastWeek = endOfWeek.minusWeeks(1);
        lastWeekMinutes += getTotalBetweenTime(childId, startOfLastWeek, endOfLastWeek);
        log.info("startOfLastWeek={}", startOfLastWeek);
        log.info("endOfLastWeek={}", endOfLastWeek);

        // 이번달
        LocalDateTime startOfMonth = now.withDayOfMonth(1).truncatedTo(ChronoUnit.DAYS);  // 이번달 1일
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusDays(1).truncatedTo(ChronoUnit.DAYS).plusDays(1);  // 이번달 말일
        thisMonthMinutes += getTotalBetweenTime(childId, startOfMonth, endOfMonth);
        log.info("startOfMonth={}", startOfMonth);
        log.info("endOfMonth={}", endOfMonth);

        return ActivityAnalysisDto.builder()
                // 독서 시간
                .readingMinutes(readingMinutesSingle + readingMinutesMulti)
                .readingMinutesSingle(readingMinutesSingle)
                .readingMinutesMulti(readingMinutesMulti)
                // 그린 시간
                .sketchingMinutes(sketchingMinutesSingle + sketchingMinutesMulti)
                .sketchingMinutesSingle(sketchingMinutesSingle)
                .sketchingMinutesMulti(sketchingMinutesMulti)
                // 이용 시간
                .thisMonthMinutes(thisMonthMinutes)
                .thisWeekMinutes(thisWeekMinutes)
                .lastWeekMinutes(lastWeekMinutes)
                // 중도 퇴장
                .earlyExitCount(earlyExitCount)
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
