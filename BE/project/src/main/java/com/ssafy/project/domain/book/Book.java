package com.ssafy.project.domain.book;

import com.ssafy.project.domain.Sketch;
import com.ssafy.project.dto.book.BookDto;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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
    private String bookPath; // 동화 이미지 경로
    private String role1;
    private String role2;

    @OneToOne(mappedBy = "book", fetch = FetchType.LAZY)
    private Sketch sketch;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    @OrderBy("pageNumber asc")
    private List<Page> pageList = new ArrayList<>();

    // Entity to Dto
    public BookDto entityToDto() {
        return BookDto.builder()
                .bookId(this.getId())
                .title(this.getTitle())
                .bookPath(this.getBookPath())
                .build();
    }
}
