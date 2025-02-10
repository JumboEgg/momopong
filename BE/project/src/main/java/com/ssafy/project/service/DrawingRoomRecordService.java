package com.ssafy.project.service;

import com.ssafy.project.dto.draw.DrawingParticipationDto;

public interface DrawingRoomRecordService {
    DrawingParticipationDto save(DrawingParticipationDto record);
}