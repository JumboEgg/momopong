package com.ssafy.project.service;

import com.ssafy.project.common.JsonConverter;
import com.ssafy.project.dao.RedisDao;
import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.book.Book;
import com.ssafy.project.domain.record.BookRecord;
import com.ssafy.project.domain.type.StatusType;
import com.ssafy.project.dto.record.BookParticipationRecordDto;
import com.ssafy.project.dto.user.ChildStatusDto;
import com.ssafy.project.repository.BookRecordRepository;
import com.ssafy.project.repository.BookRepository;
import com.ssafy.project.repository.ChildRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookRecordServiceImpl implements BookRecordService {

    private final BookRecordRepository bookParticipationRecordRepository;
    private final BookRepository bookRepository;
    private final ChildRepository childRepository;
    private final RedisDao redisDao;
    private final JsonConverter jsonConverter;
    private final CloudFrontService cloudFrontService;

    private static final String CHILD_STATUS_KEY = "child:status:%d"; // 자식 접속 상태 KEY

    @Override
    @Transactional
    public BookParticipationRecordDto save(BookParticipationRecordDto recordDto) {
        Child child = childRepository.findById(recordDto.getChildId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid child ID"));

        Book book = bookRepository.findById(recordDto.getBookId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid book ID"));

        BookRecord savedRecord = BookRecord.builder()
                .child(child)
                .book(book)
                .role(recordDto.getRole())
                .earlyExit(recordDto.getEarlyExit() != null ? recordDto.getEarlyExit() : true)
                .startTime(recordDto.getStartTime())
                .endTime(recordDto.getEndTime())
                .mode(recordDto.getMode())
                .build();

        // 접속 상태 변경 (ONLINE -> READING)
        updateStatus(StatusType.READING, child);

        bookParticipationRecordRepository.save(savedRecord);
        return savedRecord.entityToDto();
    }

    @Override
    @Transactional
    public BookParticipationRecordDto completeParticipation(Long recordId) {
        BookRecord record = bookParticipationRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid record ID"));

        record.updateExitStatus(false);
        record.setEndTimeNow();
        bookParticipationRecordRepository.save(record);

        // 접속 상태 변경 (READING -> ONLINE)
        updateStatus(StatusType.ONLINE, record.getChild());

        return record.entityToDto();
    }

    private void updateStatus(StatusType status, Child child) {
        String key = String.format(CHILD_STATUS_KEY, child.getId());
        ChildStatusDto childStatusDto = ChildStatusDto.builder()
                .childId(child.getId())
                .name(child.getName())
                .profile(cloudFrontService.getSignedUrl(child.getProfile()))
                .status(status)
                .build();

        redisDao.setValues(key, jsonConverter.toJson(childStatusDto));
    }
}