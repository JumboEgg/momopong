package com.ssafy.project.service;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.draw.DrawingRoomRecord;
import com.ssafy.project.dto.draw.DrawingParticipationDto;
import com.ssafy.project.repository.ChildRepository;
import com.ssafy.project.repository.DrawingRoomRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DrawingRoomRecordServiceImpl implements DrawingRoomRecordService {

    private final DrawingRoomRecordRepository drawingRoomRecordRepository;
    private final ChildRepository childRepository;

    @Override
    public DrawingParticipationDto  save(DrawingParticipationDto recordDto) {

        Child child = childRepository.findById(recordDto.getChild_id())
                .orElseThrow(() -> new IllegalArgumentException("해당 childId가 존재하지 않습니다."));

        DrawingRoomRecord roomRecord = DrawingRoomRecord.builder()
                .child(child)
                .startTime(recordDto.getStartTime())
                .endTime(recordDto.getEndTime())
                .mode(recordDto.getMode())
                .build();

        DrawingRoomRecord savedRecord = drawingRoomRecordRepository.save(roomRecord);

        return savedRecord.entityToDto();
    }
}