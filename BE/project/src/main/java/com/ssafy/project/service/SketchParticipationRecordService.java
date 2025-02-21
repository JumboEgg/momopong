package com.ssafy.project.service;

import com.ssafy.project.dto.record.BookParticipationRecordDto;
import com.ssafy.project.dto.record.SketchParticipationRecordDto;

public interface SketchParticipationRecordService {
    SketchParticipationRecordDto save(SketchParticipationRecordDto record);

    SketchParticipationRecordDto completeParticipation(Long recordId);
}