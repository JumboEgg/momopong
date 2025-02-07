package com.ssafy.project.domain;


import com.ssafy.project.dto.LetterDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "letter")
@EntityListeners(AuditingEntityListener.class)
public class Letter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "letter_id")
    private Long letterId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id")
    private Child child;

    private String letter;

    private String reply;

    @Column(name = "book_title")
    private String bookTitle;

    private String role;

    private String letterFileName;

    @CreatedDate
    private LocalDateTime createdAt;


    public static LetterDto entityToDto(Letter letter) {
        return LetterDto.builder()
                .bookTitle(letter.bookTitle)
                .role(letter.role)
                .content(letter.letter)
                .letterFileName(letter.letterFileName)
                .reply(letter.reply)
                .createdAt(String.valueOf(letter.createdAt))
                .build();
    }

}
