package com.ssafy.project.domain.draw;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.type.ParticipationMode;
import com.ssafy.project.dto.draw.DrawingParticipationDto;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class DrawingRoomRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "drawing_participation_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;  // 시작 시간

    @Column(name = "end_time")
    private LocalDateTime endTime;    // 종료 시간

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipationMode mode;   // 참여 모드

    // Entity to Dto
    public DrawingParticipationDto entityToDto() {
        return DrawingParticipationDto.builder()
                .drawingParticipationId(this.getId())
                .childId(this.getChild().getId())
                .startTime(this.getStartTime())
                .endTime(this.getEndTime())
                .mode(this.getMode())
                .build();
    }
}