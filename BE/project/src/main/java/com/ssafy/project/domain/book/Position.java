package com.ssafy.project.domain.book;

import com.ssafy.project.dto.PositionDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "position_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id")
    private Page page;

    private String sketchPath; // 도안 경로
    private Double x; // x좌표
    private Double y; // y좌표
    private Double ratio; // 비율
    private Double angle; // 각도

    public PositionDto entityToDto() {
        return PositionDto.builder()
                .sketchPath(this.getSketchPath())
                .x(this.getX())
                .y(this.getY())
                .ratio(this.getRatio())
                .angle(this.getAngle())
                .build();
    }
}
