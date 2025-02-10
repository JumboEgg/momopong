package com.ssafy.project.service;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.draw.DrawingRoomRecord;
import com.ssafy.project.dto.draw.DrawingParticipationDto;
import com.ssafy.project.repository.ChildRepository;
import com.ssafy.project.repository.DrawingRoomRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DrawingRoomRecordServiceImpl implements DrawingRoomRecordService {

    private final DrawingRoomRecordRepository drawingRoomRecordRepository;
    private final ChildRepository childRepository;

    @Override
    @Transactional
    public DrawingParticipationDto  save(DrawingParticipationDto recordDto) {

        Child child = childRepository.getReferenceById(recordDto.getChildId());

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