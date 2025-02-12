package com.ssafy.project.repository;

import com.ssafy.project.domain.record.BookParticipationRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookParticipationRecordRepository extends JpaRepository<BookParticipationRecord, Long> {
}
