package com.ssafy.project.domain;

import com.ssafy.project.domain.book.Book;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Sketch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sketch_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    private String sketchPath; // 도안 경로
    private String sketchTitle; // 도안 제목
}

