package com.ssafy.project.service;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.book.Book;
import com.ssafy.project.domain.record.BookRecord;
import com.ssafy.project.domain.record.BookRecordPage;
import com.ssafy.project.dto.book.AudioDto;
import com.ssafy.project.dto.book.BookDto;
import com.ssafy.project.dto.book.BookListDto;
import com.ssafy.project.dto.book.PageDto;
import com.ssafy.project.exception.NotFoundException;
import com.ssafy.project.repository.BookRecordPageRepository;
import com.ssafy.project.repository.BookRecordRepository;
import com.ssafy.project.repository.BookRepository;
import com.ssafy.project.repository.ChildRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
    private final BookRecordRepository bookRecordRepository;
    private final BookRecordPageRepository bookRecordPageRepository;
    private final ChildRepository childRepository;
    private final BookRepository bookRepository;
    private final CloudFrontService cloudFrontService;

    @Override
    public List<BookDto> bookList(Long childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new NotFoundException("해당 자식 사용자를 찾을 수 없습니다"));

        List<BookRecord> bookRecordList = bookRecordRepository.findAllByChild(child);
        log.info("bookRecordList={}", bookRecordList);

        if (bookRecordList.isEmpty()) return new ArrayList<>();

        return bookRecordList.stream()
                .map(recordBook -> {
                    Book book = bookRepository.findById(recordBook.getId())
                            .orElseThrow(() -> new NotFoundException("해당 책을 찾을 수 없습니다"));

                    return BookDto.builder()
                            .bookId(book.getId())
                            .bookPath(book.getBookPath())
                            .title(book.getTitle())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public BookListDto readBook(Long childId, Long bookRecordId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new NotFoundException("해당 자식 사용자를 찾을 수 없습니다"));

        BookRecord bookRecord = bookRecordRepository.findByIdAndChild(bookRecordId, child)
                .orElseThrow(() -> new NotFoundException("해당 동화 기록을 찾을 수 없습니다"));

        Book book = bookRepository.findById(bookRecord.getBook().getId())
                .orElseThrow(() -> new NotFoundException("해당 책을 찾을 수 없습니다"));

        // 페이지 번호로 그룹핑
        Map<Integer, List<BookRecordPage>> groupByPageNumber = bookRecordPageRepository.findAllByBookRecord(bookRecord)
                .stream()
                .sorted(Comparator.comparingLong(BookRecordPage::getBookRecordPageNumber))
                .collect(Collectors.groupingBy(BookRecordPage::getBookRecordPageNumber));

        List<PageDto> pages = new ArrayList<>();

        // 페이지별 음성 묶기
        for (Integer pageNumber : groupByPageNumber.keySet()) {
            // 같은 페이지의 오디오 음성 순서대로 정렬
            List<AudioDto> audios = groupByPageNumber.get(pageNumber).stream()
                    .sorted(Comparator.comparingInt(BookRecordPage::getAudioNumber)) // 오디오 순서대로 정렬
                    .map(recordPage -> AudioDto.builder() // AudioDto 생성
                            .order(recordPage.getAudioNumber())
                            .role(recordPage.getRole())
                            .text(recordPage.getText())
                            .path(cloudFrontService.getSignedUrl(recordPage.getAudioPath()))
                            .build())
                    .toList();

            BookRecordPage bookRecordPage = groupByPageNumber.get(pageNumber).get(0); // 제일 앞 꺼내기
            pages.add(PageDto.builder()
                    .pageId(bookRecordPage.getId()) // BookRecordPage ID (Page ID 아님!)
                    .pageNumber(pageNumber) // Page 번호
                    .pagePath(cloudFrontService.getSignedUrl(bookRecordPage.getPagePath()))
                    .audios(audios)
                    .build());
        }

        return BookListDto.builder()
                .bookId(bookRecordId) // BookRecord ID (Book ID 아님!)
                .bookTitle(book.getTitle())
                .totalPage(pages.size())
                .role1(book.getRole1())
                .role2(book.getRole2())
                .pages(pages)
                .build();
    }
}
