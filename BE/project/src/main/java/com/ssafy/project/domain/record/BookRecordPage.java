package com.ssafy.project.domain.record;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class BookRecordPage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_record_page_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_record_id")
    private BookRecord bookRecord;

    private int bookRecordPageNumber; //
    private String pagePath; // 페이지 이미지 경로
    private String audioPath; // 음성 파일 경로
    private String role; // 역할
    private String text; // 대사
    private int audioNumber; // 음성 순서
}
