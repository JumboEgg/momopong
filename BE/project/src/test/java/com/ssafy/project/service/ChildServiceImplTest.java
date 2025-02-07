package com.ssafy.project.service;

import com.ssafy.project.ProjectApplication;
import com.ssafy.project.domain.Child;
import com.ssafy.project.domain.Parent;
import com.ssafy.project.domain.type.GenderType;
import com.ssafy.project.dto.ChildDto;
import com.ssafy.project.dto.ChildSignUpRequestDto;
import com.ssafy.project.dto.ChildUpdateRequestDto;
import com.ssafy.project.dto.ParentSignUpRequestDto;
import com.ssafy.project.exception.ChildLimitExceededException;
import com.ssafy.project.exception.UserNotFoundException;
import com.ssafy.project.repository.ChildRepository;
import com.ssafy.project.repository.ParentRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest(classes = ProjectApplication.class)
@Transactional
class ChildServiceImplTest {
    @Autowired
    private ChildService childService;

    @Autowired
    private ChildRepository childRepository;

    @Autowired
    private ParentService parentService;

    @Autowired
    private ParentRepository parentRepository;

    private Parent parent;
    private Long parentId;

    @BeforeEach
    void beforeEach() {
        ParentSignUpRequestDto signUpRequestDto = ParentSignUpRequestDto.builder()
                .email("hong@test.com")
                .password("1234")
                .name("홍길동")
                .phone("010-1111-2222")
                .build();
        parentId = parentService.signup(signUpRequestDto);
        parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new UserNotFoundException("부모 사용자를 찾을 수 없습니다"));
    }

    @Test
    @DisplayName("자식 회원가입에 성공한다")
    void 자식_회원가입_성공() {
        // given
        ChildSignUpRequestDto signUpRequestDto = getSignUpRequestDto(parentId, "홍자식");

        // when
        Long saved = childService.signUp(signUpRequestDto);
        Child child = childRepository.findById(saved)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));

        // then
        assertThat(child)
                .satisfies((c) -> {
                    assertThat(c.getParent().getId()).isEqualTo(parent.getId());
                    assertThat(c.getName()).isEqualTo("홍자식");
                    assertThat(c.getProfile()).isEqualTo("url");
                    assertThat(c.getBirth()).isEqualTo(LocalDate.of(2020, 04, 20));
                    assertThat(c.getGender()).isEqualTo(GenderType.여자);
                });
    }

    @Test
    @DisplayName("자식은 부모가 없으면 회원가입에 실패한다")
    void 자식_회원가입_실패_부모없음() {
        // 존재하지 않는 부모 ID로 자식 객체 생성
        ChildSignUpRequestDto signUpRequestDto = getSignUpRequestDto(100L, "홍자식");

        assertThrows(UserNotFoundException.class,
                () -> childService.signUp(signUpRequestDto));
    }

    @Test
    @DisplayName("자식은 최대 4명까지 만들 수 있다")
    void 자식_회원가입_실패_자식수초과() {
        for (int i = 0; i < 4; i++) {
            childService.signUp(getSignUpRequestDto(parentId, "홍자식" + i));
        }

        assertThrows(ChildLimitExceededException.class,
                () -> childService.signUp(getSignUpRequestDto(parentId, "홍자식")));
    }

    private static ChildSignUpRequestDto getSignUpRequestDto(long parentId, String name) {
        return ChildSignUpRequestDto.builder()
                .parentId(parentId)
                .name(name)
                .profile("url")
                .birth(LocalDate.of(2020, 04, 20))
                .gender(GenderType.여자)
                .build();
    }

    @Test
    @DisplayName("자식 로그인에 성공한다")
    void 자식_로그인_성공() {
        // given
        ChildSignUpRequestDto signUpRequestDto = getSignUpRequestDto(parentId, "홍자식");
        Long saved = childService.signUp(signUpRequestDto);

        // when
        Map<String, Object> childMap = childService.login(saved);
        ChildDto childDto = (ChildDto) childMap.get("childDto");

        // then
        assertThat(childDto)
                .satisfies(child -> {
                    assertThat(child.getChildId()).isEqualTo(saved);
                    assertThat(child.getName()).isEqualTo(signUpRequestDto.getName());
                    assertThat(child.getProfile()).isEqualTo(signUpRequestDto.getProfile());

                    assertThat(child.getAge()).isPositive();
                    assertThat(child.getCode()).isNotNull().hasSize(8); // 친구 코드는 8글자
                    assertThat(child.getDaysSinceStart()).isGreaterThanOrEqualTo(0); // 0일 이상
                    assertThat(child.isFirstLogin()).isTrue(); // 첫 로그인
                });
    }

    @Test
    @DisplayName("자식 로그인에 실패한다")
    void 자식_로그인_실패() {
        // given
        ChildSignUpRequestDto signUpRequestDto = getSignUpRequestDto(parentId, "홍자식");
        childService.signUp(signUpRequestDto);

        // when & then
        assertThrows(UserNotFoundException.class,
                () -> childService.login(100L)); // 존재하지 않는 자식 ID로 로그인
    }

    @Test
    @DisplayName("자식 회원 정보 수정에 성공한다")
    void 자식_회원정보_수정_성공() {
        // given
        ChildSignUpRequestDto signUpRequestDto = getSignUpRequestDto(parentId, "홍자식");
        Long saved = childService.signUp(signUpRequestDto);

        ChildUpdateRequestDto updateRequestDto = ChildUpdateRequestDto.builder()
                .childId(saved)
                .name("홍홍식")
                .profile("Profile url")
                .build();

        childService.updateChild(saved, updateRequestDto);

        Child findChild = childRepository.findById(saved)
                .orElseThrow(() -> new UserNotFoundException("자식 사용자를 찾을 수 없습니다"));

        assertThat(findChild)
                .satisfies(child -> {
                    assertThat(child.getId()).isEqualTo(saved);
                    assertThat(child.getName()).isEqualTo("홍홍식");
                    assertThat(child.getProfile()).isEqualTo("Profile url");
                });
    }
}