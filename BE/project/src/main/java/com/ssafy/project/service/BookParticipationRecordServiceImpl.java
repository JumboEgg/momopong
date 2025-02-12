package com.ssafy.project.service;

import com.ssafy.project.domain.book.Book;
import com.ssafy.project.domain.record.BookParticipationRecord;
import com.ssafy.project.domain.Child;
import com.ssafy.project.dto.record.BookParticipationRecordDto;
import com.ssafy.project.repository.BookParticipationRecordRepository;
import com.ssafy.project.repository.BookRepository;
import com.ssafy.project.repository.ChildRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookParticipationRecordServiceImpl implements BookParticipationRecordService {

    private final BookParticipationRecordRepository bookParticipationRecordRepository;
    private final BookRepository bookRepository;
    private final ChildRepository childRepository;

    @Override
    @Transactional
    public BookParticipationRecordDto save(BookParticipationRecordDto recordDto) {
        Child child = childRepository.findById(recordDto.getChildId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid child ID"));

        Book book = bookRepository.findById(recordDto.getBookId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid book ID"));

        BookParticipationRecord savedRecord = BookParticipationRecord.builder()
                .child(child)
                .book(book)
                .role(recordDto.getRole())
                .earlyExit(recordDto.getEarlyExit() != null ? recordDto.getEarlyExit() : true)
                .startTime(recordDto.getStartTime())
                .endTime(recordDto.getEndTime())
                .mode(recordDto.getMode())
                .build();

        bookParticipationRecordRepository.save(savedRecord);
        return savedRecord.entityToDto();
    }

    @Override
    @Transactional
    public BookParticipationRecordDto completeParticipation(Long recordId) {
        BookParticipationRecord record = bookParticipationRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid record ID"));

        record.updateExitStatus(false);
        record.setEndTimeNow();
        bookParticipationRecordRepository.save(record);

        return record.entityToDto();
    }
}