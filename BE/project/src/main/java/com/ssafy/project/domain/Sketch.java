package com.ssafy.project.domain;

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

    private String sketchPath; // 도안 경로
    private String sketchTitle; // 도안 제목
}

