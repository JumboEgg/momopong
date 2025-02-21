package com.ssafy.project.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.Frame;
import com.ssafy.project.domain.Letter;
import com.ssafy.project.dto.FrameDto;
import com.ssafy.project.dto.LetterDto;
import com.ssafy.project.exception.UserNotFoundException;
import com.ssafy.project.repository.ChildRepository;
import com.ssafy.project.repository.FrameRepository;
import lombok.RequiredArgsConstructor;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FrameServiceImpl implements FrameService {

    private final FrameRepository frameRepository;
    private final ChildRepository childRepository;

    private final AmazonS3 amazonS3;

    private final CloudFrontService cloudFrontService;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;


    //그림(서브 컨텐츠) DB에 저장
    @Override
    public void saveFrame(Long childId, String frameTitle, String frameFileName) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));

        Frame frame = Frame.builder()
                .child(child)
                .createdAt(LocalDateTime.now())
                .frameFileName(frameFileName)
                .frameTitle(frameTitle)
                .build();

        frameRepository.save(frame);

    }

    // 아이의 그림을 dto를 list에 담아서 return
    @Override
    public List<FrameDto> getFramesByChildId(Long childId) {
        List<Frame> frames = frameRepository.findAllByChildId(childId);
        return frames.stream()
                .map(frame -> {
                    FrameDto frameDto = Frame.entityToDto(frame);
                    frameDto.updateFrameUrl(cloudFrontService.getSignedUrl(frameDto.getFrameFileName()));
//                    frameDto.updateFrameUrl(presignedUrlService.getFile(frameDto.getFrameFileName()));

                    return frameDto;
                })
                .collect(Collectors.toList());
    }

}
