package com.ssafy.project.domain.book;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Audio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audio_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id")
    private Page page;

    private String audioPath; // 음성 파일 경로
    private String role; // 역할
    private String text; // 대사
    private int audioNumber; // 음성 순서

    public void addAudio(Page page) {
        this.page = page;
        page.getAudioList().add(this);
    }
}
