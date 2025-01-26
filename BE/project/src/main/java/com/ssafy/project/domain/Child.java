package com.ssafy.project.domain;

import com.ssafy.project.domain.type.GenderType;
import com.ssafy.project.domain.type.StatusType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@EqualsAndHashCode(of = "id")
@EntityListeners(AuditingEntityListener.class)
public class Child {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "child_id")
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Parent parent;

    @NotNull
    @Size(min = 1, max = 50)
    private String name;
    private String profile;

    @NotNull
    @Past
    private LocalDate birth;
    private String code;

    @Enumerated(EnumType.STRING)
    private StatusType status;

    @Enumerated(EnumType.STRING)
    private GenderType gender;

    @Builder.Default
    private boolean login = false;

    @Builder.Default
    private boolean firstLogin = false;

    @CreatedDate
    private LocalDateTime createdAt;

    // 나이 계산 메서드
    public int getAge() {
        return Period.between(this.birth, LocalDate.from(LocalDateTime.now())).getYears();
    }

    public void updateLoginStatus(boolean login) {
        this.login = login;
    }

    public void updateFirstLogin(boolean firstLogin) {
        this.firstLogin = firstLogin;
    }

    // 연관관계 편의 메서드 (양방향)
    public void changeParent(Parent parent) {
        this.parent = parent;
        parent.getChildren().add(this);
    }
}
