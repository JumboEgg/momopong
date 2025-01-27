package com.ssafy.project.service;

import com.ssafy.project.domain.Parent;
import com.ssafy.project.domain.type.RoleType;
import com.ssafy.project.dto.LoginRequestDto;
import com.ssafy.project.dto.ParentDto;
import com.ssafy.project.dto.ParentSignUpRequestDto;
import com.ssafy.project.exception.DuplicateParentEmailException;
import com.ssafy.project.exception.UserNotFoundException;
import com.ssafy.project.repository.ParentRepository;
import com.ssafy.project.security.JwtToken;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
class ParentServiceImplTest {

    @Autowired
    private ParentService parentService;

    @Autowired
    private ParentRepository parentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("부모 회원가입에 성공한다")
    void 부모_회원가입_성공() {
        // given
        ParentSignUpRequestDto signUpDto = ParentSignUpRequestDto.builder()
                .email("hong@test.com")
                .password("1234")
                .name("홍길동")
                .phone("010-1111-2222")
                .build();

        // when
        Long savedId = parentService.signup(signUpDto);
        Parent findParent = parentRepository.findById(savedId)
                .orElseThrow(() -> new UserNotFoundException("부모 사용자를 찾을 수 없습니다"));

        // then
       assertThat(findParent)
               .satisfies(parent -> {
                   assertThat(parent.getName()).isEqualTo(signUpDto.getName());
                   assertThat(parent.getEmail()).isEqualTo(signUpDto.getEmail());
                   assertThat(parent.getPhone()).isEqualTo(signUpDto.getPhone());
                   assertThat(passwordEncoder.matches(signUpDto.getPassword(), parent.getPassword())).isTrue();
               });
    }

    @Test
    @DisplayName("이메일이 중복되면 예외가 터져야 한다")
    void 이메일_중복확인() {
        // given
        ParentSignUpRequestDto signUpDto1 = ParentSignUpRequestDto.builder()
                .email("hong@test.com")
                .password("1234")
                .name("홍길동")
                .phone("010-1111-2222")
                .build();

        ParentSignUpRequestDto signUpDto2 = ParentSignUpRequestDto.builder()
                .email("hong@test.com")
                .password("5678")
                .name("동길홍")
                .phone("010-2222-1111")
                .build();

        // when
        parentService.signup(signUpDto1);

        // then
        assertThrows(DuplicateParentEmailException.class,
                () -> parentService.signup(signUpDto2));
    }

    @Test
    @DisplayName("부모 로그인에 성공한다")
    void 부모_로그인_성공() {
        // given
        ParentSignUpRequestDto signUpDto = new ParentSignUpRequestDto("hong@test.com", "1234", "홍길동", "010-1111-2222", RoleType.PARENT);
        parentService.signup(signUpDto);

        // when
        LoginRequestDto loginDto = new LoginRequestDto("hong@test.com", "1234");
        JwtToken jwtToken = parentService.login(loginDto);

        // then
        assertThat(jwtToken)
                .satisfies(token -> {
                    assertThat(token.getGrantType()).isEqualTo("Bearer");
                    assertThat(token.getAccessToken()).isNotNull();
                    assertThat(token.getRefreshToken()).isNotNull();
                });
    }

    @Test
    @DisplayName("부모 회원정보 수정에 성공한다")
    void 부모_회원정보_수정_성공() {
        // given
        ParentSignUpRequestDto signUpDto = ParentSignUpRequestDto.builder()
                .email("hong@test.com")
                .password("1234")
                .name("홍길동")
                .phone("010-1111-2222")
                .build();
        Long saved = parentService.signup(signUpDto);

        // when
        ParentDto parentDto = ParentDto.builder()
                .parentId(saved)
                .email(signUpDto.getEmail())
                .name("홍홍홍")
                .phone("010-1111-1111")
                .build();
        parentService.updateParent(saved, parentDto);

        // then
        Parent findParent = parentRepository.findById(saved)
                .orElseThrow(() -> new UserNotFoundException("부모 정보를 찾을 수 없습니다"));

        assertThat(findParent)
                .satisfies(parent -> {
                    assertThat(parent.getId()).isEqualTo(saved);
                    assertThat(parent.getName()).isEqualTo("홍홍홍");
                    assertThat(parent.getPhone()).isEqualTo("010-1111-1111");
                });
    }
}