package com.ssafy.project.dto;

import lombok.*;

@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PositionDto {
    private String sketchPath;
    private double x;
    private double y;
    private double ratio;
    private double angle;
}
