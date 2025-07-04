package com.ssafy.project.domain.book;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Page {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "page_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    @OneToMany(mappedBy = "page", cascade = CascadeType.ALL)
    @OrderBy("audioNumber asc")
    private List<Audio> audioList = new ArrayList<>();

    private int pageNumber; // 페이지 번호
    private String pagePath; // 페이지 이미지 경로
    private boolean hasDrawing; // 그림 그리기 여부
    private boolean hasObject; // 오브젝트 존재 여부

    public void addPage(Book book) {
        this.book = book;
        book.getPageList().add(this);
    }
}
