package com.ssafy.project.domain.record;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.book.Book;
import com.ssafy.project.domain.type.ParticipationMode;
import com.ssafy.project.dto.record.BookParticipationRecordDto;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
@Table(name = "book_participation_record")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class BookRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_record_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @OneToMany(mappedBy = "bookRecord", cascade = CascadeType.ALL)
    private List<BookRecordPage> bookRecordPageList = new ArrayList<>(); // 동화 참여 기록 페이지 목록

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "early_exit", nullable = false)
    private boolean earlyExit = true;

    @CreatedDate
    @Column(name = "start_time", nullable = false, updatable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipationMode mode;

    // Entity to Dto
    public BookParticipationRecordDto entityToDto() {
        return BookParticipationRecordDto.builder()
                .bookRecordId(this.id)
                .childId(this.child.getId())
                .bookId(this.book.getId())
                .role(this.role)
                .earlyExit(this.earlyExit)
                .startTime(this.startTime)
                .endTime(this.endTime)
                .mode(this.mode)
                .build();
    }

    public void updateExitStatus(boolean status) {
        this.earlyExit = status;
    }

    public void setEndTimeNow() {
        this.endTime = LocalDateTime.now();
    }
}
