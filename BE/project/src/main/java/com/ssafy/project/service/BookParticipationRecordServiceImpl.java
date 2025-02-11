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

@Service
@RequiredArgsConstructor
public class BookParticipationRecordServiceImpl implements BookParticipationRecordService {

    private final BookParticipationRecordRepository bookParticipationRecordRepository;
    private final BookRepository bookRepository;
    private final ChildRepository childRepository;

    @Override
    @Transactional
    public BookParticipationRecordDto save(BookParticipationRecordDto bookParticipationRecordDto) {

        Child child = childRepository.findById(bookParticipationRecordDto.getChildId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid child ID"));

        Book book = bookRepository.findById(bookParticipationRecordDto.getBookId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid book ID"));

        BookParticipationRecord savedRecord = BookParticipationRecord.builder()
                .child(child)
                .book(book)
                .createdAt(bookParticipationRecordDto.getCreatedAt())
                .role(bookParticipationRecordDto.getRole())
                .earlyExit(bookParticipationRecordDto.isEarlyExit())
                .startTime(bookParticipationRecordDto.getStartTime())
                .endTime(bookParticipationRecordDto.getEndTime())
                .mode(bookParticipationRecordDto.getMode())
                .build();

        bookParticipationRecordRepository.save(savedRecord);
        return savedRecord.entityToDto();
    }

    @Override
    @Transactional
    public BookParticipationRecordDto updateExitStatus(Long recordId) {
        BookParticipationRecord record = bookParticipationRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid record ID"));

        record.updateExitStatus(false);
        bookParticipationRecordRepository.save(record);

        return record.entityToDto();
    }
}
