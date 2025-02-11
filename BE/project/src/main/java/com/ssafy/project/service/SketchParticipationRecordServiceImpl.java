package com.ssafy.project.service;

import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.record.SketchParticipationRecord;
import com.ssafy.project.dto.record.SketchParticipationRecordDto;
import com.ssafy.project.repository.ChildRepository;
import com.ssafy.project.repository.SketchParticipationRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SketchParticipationRecordServiceImpl implements SketchParticipationRecordService {

    private final SketchParticipationRecordRepository sketchParticipationRecordRepository;
    private final ChildRepository childRepository;

    @Override
    @Transactional
    public SketchParticipationRecordDto save(SketchParticipationRecordDto recordDto) {

        Child child = childRepository.getReferenceById(recordDto.getChildId());

        SketchParticipationRecord roomRecord = SketchParticipationRecord.builder()
                .child(child)
                .startTime(recordDto.getStartTime())
                .endTime(recordDto.getEndTime())
                .mode(recordDto.getMode())
                .build();

        SketchParticipationRecord savedRecord = sketchParticipationRecordRepository.save(roomRecord);

        return savedRecord.entityToDto();
    }
}