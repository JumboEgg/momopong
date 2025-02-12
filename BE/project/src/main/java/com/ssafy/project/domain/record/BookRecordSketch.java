package com.ssafy.project.domain.record;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BookRecordSketch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_record_sketch_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_record_page_id")
    private BookRecordPage bookRecordPage;

    private String bookRecordSketchPath; // 오브젝트 저장 경로

    public void updateBookRecordSketch(BookRecordPage bookRecordPage) {
        this.bookRecordPage = bookRecordPage;
        bookRecordPage.getBookRecordSketchList().add(this);
    }
}
