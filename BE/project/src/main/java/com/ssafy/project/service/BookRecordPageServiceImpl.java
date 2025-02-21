package com.ssafy.project.service;


import com.ssafy.project.domain.record.BookRecord;
import com.ssafy.project.domain.record.BookRecordPage;
import com.ssafy.project.dto.record.BookRecordPageDto;
import com.ssafy.project.dto.record.BookRecordPageIdDto;
import com.ssafy.project.repository.BookRecordPageRepository;
import com.ssafy.project.repository.BookRecordRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class BookRecordPageServiceImpl implements BookRecordPageService{

    private final BookRecordRepository bookParticipationRecordRepository;
    private final BookRecordPageRepository bookRecordPageRepository;

    @Override
    public BookRecordPageIdDto saveRecordPage(BookRecordPageDto bookRecordPageDto){
        // 나의 book record
        BookRecord bookParticipationRecord = bookParticipationRecordRepository.findById(bookRecordPageDto.getBookRecordId())
            .orElseThrow(() -> new RuntimeException("Book record not found"));
        // 상대방의 book record
        BookRecord partnerBookrecord = bookParticipationRecordRepository.findById(bookRecordPageDto.getPartnerBookRecordId())
                .orElseThrow(() -> new RuntimeException("Book record not found"));

        BookRecordPage bookRecordPage = BookRecordPage.builder()
                .bookRecord(bookParticipationRecord)
                .bookRecordPageNumber(bookRecordPageDto.getBookRecordPageNumber())
                .pagePath(bookRecordPageDto.getPagePath())
                .audioPath(bookRecordPageDto.getAudioPath())
                .role(bookRecordPageDto.getRole())
                .text(bookRecordPageDto.getText())
                .audioNumber(bookRecordPageDto.getAudioNumber())
                .build();

        BookRecordPage partnerbookRecordPage = BookRecordPage.builder()
                .bookRecord(partnerBookrecord)
                .bookRecordPageNumber(bookRecordPageDto.getBookRecordPageNumber())
                .pagePath(bookRecordPageDto.getPagePath())
                .audioPath(bookRecordPageDto.getAudioPath())
                .role(bookRecordPageDto.getRole())
                .text(bookRecordPageDto.getText())
                .audioNumber(bookRecordPageDto.getAudioNumber())
                .build();

        BookRecordPage savedPage = bookRecordPageRepository.save(bookRecordPage);
        BookRecordPage savedPartnerPage = bookRecordPageRepository.save(partnerbookRecordPage);

        return BookRecordPageIdDto.builder()
                .bookRecordPageId(savedPage.getId())
                .partnerBookRecordPageId(savedPartnerPage.getId())
                .build();
    }
}
