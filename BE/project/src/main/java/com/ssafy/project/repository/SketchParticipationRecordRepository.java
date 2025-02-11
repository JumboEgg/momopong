package com.ssafy.project.repository;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.record.SketchParticipationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SketchParticipationRecordRepository extends JpaRepository<SketchParticipationRecord, Long> {
    List<SketchParticipationRecord> findAllByChild(Child child);

    // 기간별 시간 조회
    @Query(value = """
            SELECT COALESCE(SUM(TIMESTAMPDIFF(MINUTE, start_time, end_time)), 0)
            FROM sketch_participation_record
            WHERE child_id = :childId
            AND start_time between :start and :end
            """, nativeQuery = true)
    Long totalBetweenTime(@Param("childId") Long childId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
