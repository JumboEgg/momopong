package com.ssafy.project.service;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.record.BookParticipationRecord;
import com.ssafy.project.domain.record.SketchParticipationRecord;
import com.ssafy.project.domain.type.ParticipationMode;
import com.ssafy.project.dto.report.ActivityAnalysisDto;
import com.ssafy.project.dto.report.ActivityHistoryDto;
import com.ssafy.project.exception.NotFoundException;
import com.ssafy.project.repository.BookParticipationRecordRepository;
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

    //  독서 시간, 그린 시간, 평균 이용 시간(이번달, 이번주, 지난주), 중도 퇴장 횟수
    // + 싱글 모드 / 멀티 모드
    @Override
    public ActivityAnalysisDto activityAnalysis(Long childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new NotFoundException("해당 자식 사용자를 찾을 수 없습니다"));

        List<BookParticipationRecord> bookRecordList = bookParticipationRecordRepository.findAllByChild(child);
        List<SketchParticipationRecord> sketchRecordList = sketchParticipationRecordRepository.findAllByChild(child);

        long readingMinutesSingle = 0, readingMinutesMulti = 0; // 독서 시간
        int earlyExitCount = 0; // 증도 퇴장 횟수
        for (BookParticipationRecord bookRecord : bookRecordList) {
            // 중도 퇴장했거나 종료 시간이 없으면 활동 시간 세지 않기
            // 중도 퇴장 횟수
            if (bookRecord.isEarlyExit()) {
                earlyExitCount++;
                continue;
            }

            // 종료 시간 없음
            if (bookRecord.getEndTime() == null) continue;

            // 싱글 모드 / 멀티 모드 별 독서 시간
            long minutes = Duration.between(bookRecord.getStartTime(), bookRecord.getEndTime()).toMinutes();
            if (bookRecord.getMode() == ParticipationMode.SINGLE) {
                readingMinutesSingle += minutes;
            } else {
                readingMinutesMulti += minutes;
            }
        }

        long sketchingMinutesSingle = 0, sketchingMinutesMulti = 0;
        for (SketchParticipationRecord sketchRecord : sketchRecordList) {
            // 중도 퇴장했거나 종료 시간이 없으면 활동 시간 세지 않기
            // 중도 퇴장 횟수
            if (sketchRecord.isEarlyExit()) {
                earlyExitCount++;
                continue;
            }

            // 종료 시간 없음
            if (sketchRecord.getEndTime() == null) continue;

            // 싱글 모드 / 멀티 모드 별 그린 시간
            long minutes = Duration.between(sketchRecord.getStartTime(), sketchRecord.getEndTime()).toMinutes();
            if (sketchRecord.getMode() == ParticipationMode.SINGLE) {
                sketchingMinutesSingle += minutes;
            } else {
                sketchingMinutesMulti += minutes;
            }
        }

        long thisMonthMinutes = 0, thisWeekMinutes = 0, lastWeekMinutes = 0;
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
        lastWeekMinutes += getTotalBetweenTime(childId, startOfLastWeek, endOfLastWeek);
        log.info("startOfLastWeek={}", startOfLastWeek);
        log.info("endOfLastWeek={}", endOfLastWeek);

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
