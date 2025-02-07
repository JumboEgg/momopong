package com.ssafy.project.domain;

import com.ssafy.project.dto.FrameDto;
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
@Table(name="frame")
@EntityListeners(AuditingEntityListener.class)
public class Frame {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "frame_id")
    private Long frameId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id")
    private Child child;

    @CreatedDate
    private LocalDateTime createdAt;

    private String frameFileName;

    private String frameTitle;

    public static FrameDto entityToDto(Frame frame){
        return FrameDto.builder()
                .frameTitle(frame.frameTitle)
                .frameFileName(frame.frameFileName)
                .createdAt(String.valueOf(frame.createdAt))
                .build();
    }



}
