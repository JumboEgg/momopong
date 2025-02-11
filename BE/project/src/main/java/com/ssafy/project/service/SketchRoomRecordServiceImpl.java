package com.ssafy.project.service;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.draw.SketchRoomRecord;
import com.ssafy.project.dto.draw.SketchParticipationDto;
import com.ssafy.project.repository.ChildRepository;
import com.ssafy.project.repository.SketchRoomRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SketchRoomRecordServiceImpl implements SketchRoomRecordService {

    private final SketchRoomRecordRepository sketchRoomRecordRepository;
    private final ChildRepository childRepository;

    @Override
    @Transactional
    public SketchParticipationDto save(SketchParticipationDto recordDto) {

        Child child = childRepository.getReferenceById(recordDto.getChildId());

        SketchRoomRecord roomRecord = SketchRoomRecord.builder()
                .child(child)
                .startTime(recordDto.getStartTime())
                .endTime(recordDto.getEndTime())
                .mode(recordDto.getMode())
                .build();

        SketchRoomRecord savedRecord = sketchRoomRecordRepository.save(roomRecord);

        return savedRecord.entityToDto();
    }
}