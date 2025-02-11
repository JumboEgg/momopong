package com.ssafy.project.repository;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.record.BookParticipationRecord;
import com.ssafy.project.dto.report.ActivityHistoryDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookParticipationRecordRepository extends JpaRepository<BookParticipationRecord, Integer> {
    // 아이별 동화 참여 기록 조회
    List<BookParticipationRecord> findAllByChild(Child child);

    // 기간별 시간 조회
    @Query(value = """
        SELECT COALESCE(SUM(TIMESTAMPDIFF(MINUTE, start_time, end_time)), 0)
        FROM book_participation_record
        WHERE child_id = :childId
        AND created_at between :start and :end
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
}
