package com.ssafy.project.repository;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.record.BookParticipationRecord;
import com.ssafy.project.dto.report.ActivityHistoryDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookParticipationRecordRepository extends JpaRepository<BookParticipationRecord, Long> {
    // 아이별 동화 참여 기록 조회
    List<BookParticipationRecord> findAllByChild(Child child);

    // 아이별 & 기간별 BookParticipationRecord 조회
    @Query(value = """
        SELECT b FROM BookParticipationRecord b
        WHERE b.child = :child
        AND b.startTime IS NOT NULL
        AND b.endTime IS NOT NULL
        AND b.startTime BETWEEN :start AND :end
        AND b.endTime BETWEEN :start AND :end
    """)
    List<BookParticipationRecord> findBookRecordByPeriod(@Param("child") Child child, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);


    // 기간별 시간 조회
    @Query(value = """
        SELECT COALESCE(SUM(TIMESTAMPDIFF(MINUTE, start_time, end_time)), 0)
        FROM book_participation_record
        WHERE child_id = :childId
        AND early_exit = FALSE
        AND start_time IS NOT NULL
        AND end_time IS NOT NULL
        AND start_time BETWEEN :start and :end
        AND end_time BETWEEN :start and :end
    """, nativeQuery = true)
    Long totalBetweenTime(@Param("childId") Long childId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // 많이 읽은 책 (3개만 조회)
    @Query(value = """
            select a.title as bookTitle, a.book_path as bookPath, b.readCount
            from book a\s
            join (
                select book_id, count(book_id) as readCount
                from book_participation_record
                where child_id = :childId
                group by book_id
                order by count(book_id) desc
                limit 3
            ) b
            on a.book_id = b.book_id;
        """, nativeQuery = true)
    List<ActivityHistoryDto> mostReadBooks(@Param("childId") Long childId);

    Optional<BookParticipationRecord> findByIdAndChild(Long bookRecordId, Child child);
}
