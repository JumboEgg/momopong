package com.ssafy.project.domain.book;

import com.ssafy.project.dto.book.BookDto;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Long id;

    private String title; // 동화 제목

    private String thumbnail; // 썸네일 URL

    private int totalPage; // 총 페이지 수

    @CreatedDate
    private LocalDate regDate; // 등록일

    // Entity to Dto
    public BookDto entityToDto() {
        return BookDto.builder()
                .bookId(this.getId())
                .title(this.getTitle())
                .thumbnail(this.getThumbnail())
                .build();
    }
}
