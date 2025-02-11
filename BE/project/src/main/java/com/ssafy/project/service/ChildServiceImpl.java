package com.ssafy.project.service;

import com.ssafy.project.common.JsonConverter;
import com.ssafy.project.dao.RedisDao;
import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.Parent;
import com.ssafy.project.domain.type.StatusType;
import com.ssafy.project.dto.user.ChildDto;
import com.ssafy.project.dto.user.ChildSignUpRequestDto;
import com.ssafy.project.dto.user.ChildStatusDto;
import com.ssafy.project.dto.user.ChildUpdateRequestDto;
import com.ssafy.project.exception.ChildLimitExceededException;
import com.ssafy.project.exception.UserNotFoundException;
import com.ssafy.project.repository.ChildRepository;
import com.ssafy.project.repository.ParentRepository;
import com.ssafy.project.security.JwtTokenProvider;
import com.ssafy.project.security.TokenBlacklistService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class ChildServiceImpl implements ChildService {
    private final ParentRepository parentRepository;
    private final ChildRepository childRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final JsonConverter jsonConverter;
    private final TokenBlacklistService tokenBlacklistService;
    private final RedisDao redisDao;
    private final PresignedUrlService presignedUrlService;

    private static final String CHILD_STATUS_KEY = "child:status:%d";
    // 서브 회원가입
    @Override
    public Long signUp(ChildSignUpRequestDto signUpRequestDto) {
        Parent parent = parentRepository.findById(signUpRequestDto.getParentId())
                .orElseThrow(() -> new UserNotFoundException("부모 사용자를 찾을 수 없습니다"));

        // 자식은 최대 4명까지
        if (parent.getChildren().size() >= 4)
            throw new ChildLimitExceededException("자식은 최대 4명까지 등록할 수 있습니다");

        // 친구 코드 생성하기
        String code = generateRandomCode();

        Child child = Child.builder()
                .name(signUpRequestDto.getName())
                .profile(signUpRequestDto.getProfile()) // Presigned URL 요청으로 얻은 fileName
                .birth(signUpRequestDto.getBirth())
                .code(code)
                .gender(signUpRequestDto.getGender())
                .firstLogin(true)
                .build();

        // 부모에 자식 정보, 자식에 부모 정보 추가하기
        child.changeParent(parent);
        Child savedChild = childRepository.save(child);

        return savedChild.getId();
    }

    // 친구 코드 
    private String generateRandomCode() {
        UUID uuid = UUID.randomUUID();

        // UUID 마지막 32비트만 가져오기
        long last32BIts = uuid.getLeastSignificantBits() & 0xFFFFFFFFL;

        // 8자리 숫자 범위로 변환하기
        long numericCode = (last32BIts % 90000000L) + 10000000L;
        System.out.println("numericCode = " + numericCode);
        return String.valueOf(numericCode);
    }

    // 자식 로그인
    @Override
    public Map<String, Object> login(Long childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));

        String accessToken = jwtTokenProvider.generateChildToken(childId);

        ChildDto childDto = ChildDto.builder()
                .childId(childId)
                .name(child.getName())
                .profile(presignedUrlService.getFile(child.getProfile()))
                .age(child.getAge())
                .daysSinceStart(child.getDaysSinceStart())
                .code(child.getCode())
                .firstLogin(child.isFirstLogin())
                .build();

        // 첫 로그인이었으면 상태 변경하기
        if (child.isFirstLogin())
            child.updateFirstLogin(false);

        // 온라인으로 상태 변경 (Redis에서 상태 관리)
        String key = String.format(CHILD_STATUS_KEY, childId);
        ChildStatusDto statusDto = ChildStatusDto.builder()
                .childId(childId)
                .name(child.getName())
                .status(StatusType.ONLINE)
                .build();

        // 문자열로 변환 후 Redis에 저장
        redisDao.setValues(key, jsonConverter.toJson(statusDto));

        Map<String, Object> map = new HashMap<>();
        map.put("childDto", childDto);
        map.put("accessToken", accessToken);
        return map;
    }

    // 로그아웃 
    @Override
    public void logout(String authorization, Long childId) {
        String key = String.format(CHILD_STATUS_KEY, childId); // 자식 상태 삭제
        redisDao.deleteValues(key);
        // 자식 accessToken 블랙리스트에 저장
        String accessToken = authorization.substring(7);
        tokenBlacklistService.addBlacklist(accessToken);
    }

    // 자식계정 조회
    @Override
    public ChildDto findChild(Long childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));

        ChildDto childDto = child.entityToDto();
        childDto.updateProfile(presignedUrlService.getFile(childDto.getProfile()));
        return childDto;
    }

    // 자식 회원 정보 수정
    @Override
    public ChildDto updateChild(Long childId, ChildUpdateRequestDto updateRequestDto) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));

        child.updateChild(updateRequestDto.getName(), updateRequestDto.getProfile());

        ChildDto childDto = child.entityToDto();
        childDto.updateProfile(presignedUrlService.getFile(childDto.getProfile()));
        return childDto;
    }

    // 자식 계정 삭제
    @Override
    @Transactional
    public void deleteChild(Long childId) {
        childRepository.deleteById(childId);
    }
}
