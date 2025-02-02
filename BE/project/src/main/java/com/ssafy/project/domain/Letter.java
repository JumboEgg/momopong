package com.ssafy.project.domain;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "letter")
public class Letter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "letter_id")
    private Long letterId;

    @Column(name = "child_id")
    private Integer childId;

    @Column(name = "letter")
    private String letter;

    @Column(name = "reply")
    private String reply;

    @Column(name = "role")
    private String role;

    @Column(name = "letter_record")
    private String letterRecord;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
