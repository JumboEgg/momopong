package com.ssafy.project.repository;

import com.ssafy.project.domain.record.BookRecord;
import com.ssafy.project.domain.record.BookRecordPage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRecordPageRepository extends JpaRepository<BookRecordPage, Long> {
    List<BookRecordPage> findAllByBookRecord(BookRecord bookRecord);
}
