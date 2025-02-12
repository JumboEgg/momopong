package com.ssafy.project.repository;

import com.ssafy.project.domain.record.BookRecordPage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRecordPageRepository extends JpaRepository<BookRecordPage, Long> {
}
