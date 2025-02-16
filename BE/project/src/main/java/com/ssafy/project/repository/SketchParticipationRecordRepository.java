package com.ssafy.project.repository;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.record.SketchParticipationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SketchParticipationRecordRepository extends JpaRepository<SketchParticipationRecord, Long> {
    // 아이별 그림 참여 기록 조회
    List<SketchParticipationRecord> findAllByChild(Child child);

    // 아이별 & 기간별 BookParticipationRecord 조회
    @Query(value = """
        SELECT s FROM SketchParticipationRecord s
        WHERE s.child = :child
        AND s.startTime IS NOT NULL
        AND s.startTime BETWEEN :start AND :end
    """)
    List<SketchParticipationRecord> findSketchRecordByPeriod(@Param("child") Child child, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // 기간별 시간 조회
    @Query(value = """
            SELECT COALESCE(SUM(TIMESTAMPDIFF(MINUTE, start_time, end_time)), 0)
            FROM sketch_participation_record
            WHERE child_id = :childId
            AND early_exit = FALSE
            AND start_time IS NOT NULL
            AND end_time IS NOT NULL
            AND start_time between :start and :end
            AND end_time BETWEEN :start and :end
            """, nativeQuery = true)
    Long totalBetweenTime(@Param("childId") Long childId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
