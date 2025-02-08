package com.ssafy.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrawingDto {
    private String status;
    private String color;
    private double prevX;
    private double prevY;
    private double curX;
    private double curY;
    private String roomId;
}
