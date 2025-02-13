package com.ssafy.project.service;

import com.ssafy.project.domain.record.BookRecordPage;
import com.ssafy.project.domain.record.BookRecordSketch;
import com.ssafy.project.dto.record.BookRecordSketchDto;
import com.ssafy.project.exception.NotFoundException;
import com.ssafy.project.repository.BookRecordPageRepository;
import com.ssafy.project.repository.BookRecordSketchRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@PreAuthorize("hasRole('CHILD')")
@Transactional
@RequiredArgsConstructor
public class BookRecordSketchServiceImpl implements BookRecordSketchService {
    private final BookRecordSketchRepository bookRecordSketchRepository;
    private final BookRecordPageRepository bookRecordPageRepository;

    @Override
    public void saveSketch(BookRecordSketchDto bookRecordSketchDto) {
        BookRecordPage bookRecordPage = bookRecordPageRepository.findById(bookRecordSketchDto.getBookRecordPageId())
                .orElseThrow(() -> new NotFoundException("해당 동화 참여 기록 페이지를 찾을 수 없습니다"));

        // 동화 참여 오브젝트 기록 저장
        BookRecordSketch bookRecordSketch = BookRecordSketch.builder()
                .bookRecordPage(bookRecordPage)
                .bookRecordSketchPath(bookRecordSketchDto.getBookRecordSketchPath())
                .build();

        bookRecordSketch.updateBookRecordSketch(bookRecordPage);

        bookRecordSketchRepository.save(bookRecordSketch);
    }
}
