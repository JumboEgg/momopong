package com.ssafy.project.domain.record;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.type.ParticipationMode;
import com.ssafy.project.dto.record.SketchParticipationRecordDto;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class SketchParticipationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sketch_participation_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    @CreatedDate
    @Column(name = "start_time", nullable = false, updatable = false)
    private LocalDateTime startTime;  // 시작 시간

    @Column(name = "end_time")
    private LocalDateTime endTime;    // 종료 시간

    @Column(name = "early_exit", nullable = false)
    private boolean earlyExit = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipationMode mode;   // 참여 모드

    // Entity to Dto
    public SketchParticipationRecordDto entityToDto() {
        return SketchParticipationRecordDto.builder()
                .sketchParticipationId(this.id)
                .childId(this.child.getId())
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