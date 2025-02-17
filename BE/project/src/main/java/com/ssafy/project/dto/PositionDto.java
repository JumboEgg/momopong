package com.ssafy.project.dto;

import lombok.*;

@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PositionDto {
    private String sketchPath;
    private Double x;
    private Double y;
    private Double ratio;
    private Double angle;
}
