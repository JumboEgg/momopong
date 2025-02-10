package com.ssafy.project.domain.book;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="audio")
@EntityListeners(AuditingEntityListener.class)
public class Audio {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audio_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id")
    private Page page; // 페이지 아이디

    private String audioUrl; // Cloud Front를 위한 거

//    private String audioFileName; //CF 안쓰면 필요한거

    private String role; // 음성의 역할

    private String text; // 음성의 대사 이거필요한거임???

    @CreatedDate
    private LocalDate regDate; // 등록일
}
