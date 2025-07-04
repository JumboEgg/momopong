package com.ssafy.project.service;

import com.ssafy.project.common.JsonConverter;
import com.ssafy.project.dao.RedisDao;
import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.record.SketchParticipationRecord;
import com.ssafy.project.domain.type.StatusType;
import com.ssafy.project.dto.record.SketchParticipationRecordDto;
import com.ssafy.project.dto.user.ChildStatusDto;
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
    private final RedisDao redisDao;
    private final JsonConverter jsonConverter;
    private final CloudFrontService cloudFrontService;

    private static final String CHILD_STATUS_KEY = "child:status:%d"; // 자식 접속 상태 KEY

    @Override
    @Transactional
    public SketchParticipationRecordDto save(SketchParticipationRecordDto recordDto) {

        Child child = childRepository.getReferenceById(recordDto.getChildId());

        SketchParticipationRecord roomRecord = SketchParticipationRecord.builder()
                .child(child)
                .startTime(recordDto.getStartTime())
                .endTime(recordDto.getEndTime())
                .earlyExit(recordDto.getEarlyExit() != null ? recordDto.getEarlyExit() : true)
                .mode(recordDto.getMode())
                .build();

        SketchParticipationRecord savedRecord = sketchParticipationRecordRepository.save(roomRecord);

        // 접속 상태 변경 (ONLINE -> DRAWING)
        updateStatus(StatusType.DRAWING, child);

        return savedRecord.entityToDto();
    }

    @Override
    @Transactional
    public SketchParticipationRecordDto completeParticipation(Long recordId) {
        SketchParticipationRecord record = sketchParticipationRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid record ID"));

        record.updateExitStatus(false);
        record.setEndTimeNow();
        sketchParticipationRecordRepository.save(record);

        // 접속 상태 변경 (DRAWING -> ONLINE)
        updateStatus(StatusType.ONLINE, record.getChild());

        return record.entityToDto();
    }

    private void updateStatus(StatusType status, Child child) {
        String key = String.format(CHILD_STATUS_KEY, child.getId());
        ChildStatusDto childStatusDto = ChildStatusDto.builder()
                .childId(child.getId())
                .name(child.getName())
                .profile(cloudFrontService.getSignedUrl(child.getProfile()))
                .status(status)
                .build();

        redisDao.setValues(key, jsonConverter.toJson(childStatusDto));
    }
}