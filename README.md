# 모모퐁
## 프로젝트 진행 기간
### 2025.01.13 ~ 2025.02.20(6주)

## 🏝️ Introduction
### 모험 가득한 "동화나라"로 퐁당!
친구와 읽고, 그리고, 소통하는 **정서교육** 플랫폼, <span style="color:orange">**모모퐁**</span>입니다!

### 기획 배경
> **유아의 주중 유튜브 1일 사용시간에 대해서 분석한 결과, 평균적으로 주중100-130분 사이로 1시간 이상을 시청하는 것으로 나타났다.** <br><br>전진호, 「유튜브(YouTube) 이용 형태가유아 보호자의 미디어 교육 경험과필요성 차이 연구」, 유아교육ㆍ보육복지 연구, 26권 3호, p30

> **미디어 이용 시간이 증가할수록 아동의 학교적응 수준이 낮아지는 것으로 드러났다.** <br><br>이민지; 송주현 , 「코로나19로 인한 아동의 미디어 이용 및 신체활동이 인지적, 정서적 집행기능을 매개로 학교적응에 미치는 영향」,
육아정책연구, 17권 1호, p183 


**_하지만 지금, 우리는 아동을 미디어와 완벽히 분리시킬 수 없지 않나요?_**
흐름을 피할 수 없다면, 그것을 교육적으로 활용해야만 합니다.

#### 🦊<span style="color:orange">**모모퐁**</span>은 이렇습니다.
-  동화 속 인물에 대한 이해와 공감을 바탕으로 아이의 정서 발달에 도움이 됩니다!
- 친구와 함께 읽고 그리는 경험을 통해 협동심을 길러요
- 동화 속에 등장하는 오브젝트를 상상해 보며 창의력을 발달시켜요
- 가족과 함께 동화 나라를 여행할 수도 있어요!


### 1) 페르소나
![Persona](./ETC/persona.png)

### 2) 고객 여정 지도
![ClientMap](./ETC/clientmap.png)


### 3) 시장 조사
- 시장 조사 결과 동화 구연 서비스는 다양하게 서비스되고 있었지만 RTC를 활용한 서비스는 확인하지 못함
- 그림을 '함께'그리고 동화 속에 등장시키는 서비스 X

### 4) 차별점
- 친구와의 실시간 소통 ✔️
- 동화 속, 동화 밖 그림판 이용 ✔️
- 동화 속 등장인물에게 편지 보내기 ✔️

### 5) 기대효과
#### 🧒아이 측면
- 동화 대사 읽기를 통한 언어 발달 촉진
- 등장인물에게 몰입하고 친구와의 교류를 통한 정서 발달
- 협력을 통한 사회성 발달

#### 👫부모 측면
- 효과적인 교육 도구로써 활용 가능
- 아이의 독서 경향성 파악 가능
- 부모와 자녀의 새로운 소통 창구



## 1️⃣ 프로젝트 구조
### 사용한 기술 스택
- **Front-end** <br>
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=TailwindCSS&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-brown?style=flat-square&logo=npm&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=flat-square&logo=socketdotio&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=flat-square&logo=webrtc&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white)

- **Back-end** <br>

- **Infra** <br>

---

### Back-end
```
src
├─main
│  ├─generated
│  ├─java
│  │  └─com
│  │      └─ssafy
│  │          └─project
│  │              ├─common
│  │              ├─config
│  │              ├─controller
│  │              ├─dao
│  │              ├─domain
│  │              │  ├─book
│  │              │  ├─record
│  │              │  └─type
│  │              ├─dto
│  │              │  ├─book
│  │              │  ├─friend
│  │              │  ├─invitation
│  │              │  ├─record
│  │              │  ├─report
│  │              │  └─user
│  │              ├─exception
│  │              │  └─friend
│  │              ├─firebase
│  │              ├─handler
│  │              ├─repository
│  │              ├─security
│  │              └─service
│  └─resources
└─test
    └─java
        └─com
            └─ssafy
                └─project
                    ├─security
                    └─service
```
### Front-end
```
 ├── src
 ├──  │   api
 ├──  │    │   axios.ts
 ├──  │    │   storyApi.ts
 ├──  │   App.css
 ├──  │   App.tsx
 ├──  │   components
 ├──  │    │   auth
 ├──  │    │    │   CustomInput.tsx
 ├──  │    │   BackgroundMusic.tsx
 ├──  │    │   common
 ├──  │    │    │   buttons
 ├──  │    │    │    │   ...
 ├──  │    │    │   LoadingPage.tsx
 ├──  │    │    │   modals
 ├──  │    │    │    │   AddFriendModal.tsx
 ├──  │    │    │    │   ...
 ├──  │    │    │   multiplayPages
 ├──  │    │    │    │   InvitationWaitPage.tsx
 ├──  │    │    │    │   NetworkerrorPage.tsx
 ├──  │    │    │   numberpad
 ├──  │    │    │    │   NumberPad.tsx
 ├──  │    │    │   PopText.tsx
 ├──  │    │    │   ...
 ├──  │    │   drawing
 ├──  │    │    │   canvasComponents
 ├──  │    │    │    │   Color.tsx
 ├──  │    │    │    │   ...
 ├──  │    │    │   data
 ├──  │    │    │    │   colorList.ts
 ├──  │    │    │   drawingMode
 ├──  │    │    │    │   DrawingPage.tsx
 ├──  │    │    │    │   ...
 ├──  │    │    │   hooks
 ├──  │    │    │    │   useSocketStore.ts
 ├──  │    │    │   modeSelection
 ├──  │    │    │    │   DrawingModeSelection.tsx
 ├──  │    │    │    │   DrawingTemplateSelection.tsx
 ├──  │    │    │   types
 ├──  │    │    │    │   custom.d.ts
 ├──  │    │    │    │   drawing.d.ts
 ├──  │    │    │    │   socket.d.ts
 ├──  │    │   friends
 ├──  │    │    │   FriendList.tsx
 ├──  │    │    │   ...
 ├──  │    │   ImageUpload.tsx
 ├──  │    │   myhouse
 ├──  │    │    │   mybookstory.tsx
 ├──  │    │    │   ...
 ├──  │    │   parentReport
 ├──  │    │    │   components
 ├──  │    │    │    │   DonutChart.tsx
 ├──  │    │    │   tabs
 ├──  │    │    │    │   ...
 ├──  │    │   ProtectedRoute.tsx
 ├──  │    │   stories
 ├──  │    │    │   AudioPlayer.tsx
 ├──  │    │    │   data
 ├──  │    │    │    │   cinderella.ts
 ├──  │    │    │   ModeSelection
 ├──  │    │    │    │   ModeSelection.tsx
 ├──  │    │    │   StoryContainer.tsx
 ├──  │    │    │   StoryMode
 ├──  │    │    │    │   IntegratedRoom.tsx
 ├──  │    │    │    │   ...
 ├──  │    │    │   types
 ├──  │    │    │    │   story.ts
 ├──  │    │    │   utils
 ├──  │    │    │    │   audioHelper.ts
 ├──  │    │    │    │   audioUtils.ts
 ├──  │    │   video
 ├──  │    │    │   AudioComponent.tsx
 ├──  │    │    │   ...
 ├──  │   env.d.ts
 ├──  │   hooks
 ├──  │    │   useFirebaseMessaging.ts
 ├──  │   index.css
 ├──  │   lib
 ├──  │    │   utils.ts
 ├──  │   main.tsx
 ├──  │   pages
 ├──  │    │   auth
 ├──  │    │    │   Login.tsx
 ├──  │    │    │   SignUp.tsx
 ├──  │    │   Drawing.tsx
 ├──  │    │   ...
 ├──  │    │   subAccount
 ├──  │    │    │   SubAccountForm.tsx
 ├──  │    │    │   ...
 ├──  │    │   Test.tsx
 ├──  │   services
 ├──  │    │   firebaseService.ts
 ├──  │    │   tokenService.ts
 ├──  │   stores
 ├──  │    │   authStore.ts
 ├──  │    │   book
 ├──  │    │    │   bookContentStore.ts
 ├──  │    │    │   ...
 ├──  │    │   drawing
 ├──  │    │    │   base64ToBlob.ts
 ├──  │    │    │   ...
 ├──  │    │   friendListStore.ts
 ├──  │    │   friendRequestStore.ts
 ├──  │    │   friendStore.ts
 ├──  │    │   letter
 ├──  │    │    │   letterStore.ts
 ├──  │    │    │   recentLetterStore.ts
 ├──  │    │   loginStore.ts
 ├──  │    │   ...
 ├──  │   types
 ├──  │    │   auth.ts
 ├──  │    │   ...
 ├──  │   utils
 ├──  │    │   auth.ts
 ├──  │    │   bookS3
 ├──  │    │    │   bookRecordCreate.ts
 ├──  │    │    │   ...
 ├──  │    │   drawingS3
 ├──  │    │    │   drawingLoad.ts
 ├──  │    │    │   ...
 ├──  │    │   letterS3
 ├──  │    │    │   audioLoad.ts
 ├──  │    │    │   ...
 ├── tailwind.config.js
 ├── tsconfig.json
 ├── tsconfig.node.json
 ├── vite.config.ts

```

## 2️⃣ 산출물
### 📌 ERD
![ERD](./ETC/ERD.png)

### 📌 시스템 아키텍처
![architecture](./ETC/architecture.png)

### Figma
[🍬Figma로 이동](https://www.figma.com/design/PbHZbvgzpNscVgBcnAUBdU/%EC%82%BC%EC%A1%B0%ED%95%91-%EA%B3%B5%ED%86%B5?node-id=231-460&t=PIwqd8sr5L64774w-1)


## 1️⃣ Jira Sprint
### Step1. Sub-PTJ 1
**[1월 13일 - 1월 17일]**
| **날짜** | **전체** | **구현진** | **박준현** | **윤지원** | **이하리** | **정은아** | **허정은** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/13 | 프로젝트 주제 회의 및 피드백, 컨설턴트 코치님 1차 사전 미팅 | 아이디어 주제 관련 조사, JPA 상속 관계 학습 | Docker 학습 , 아키텍쳐 조사 | 관련 자료 조사, 리액트 상태 관리 학습, 기술스택 조사  | 아이디어 주제 관련 기존 유사 서비스 조사, React컴포넌트 학습 | 사유결석(독감) | 아이디어 구체화 및 기존 유사 서비스 조사, React UI 공식문서 학습 |
| 1/14 | 프로젝트 주제 회의 및 피드백 | 인프라 기획 및 컨펌, Spring Security 로그인 학습 | AWS 학습 및 인프라 기획 및 1차 컨펌 | 피그마 컴포넌트 관리 학습, 아이디어 뒷받침할 논문 근거 조사 | 아이디어 기획, 개발 배경조사, 프론트 기술스택 설정 | PM 특강, git branch, merge등 개념 학습, 인프라 기획 및 컨펌 | 아이디어 발전 및 구체화, 기존 유사 서비스 조사 |
| 1/15 | 프로젝트 주제 최종 채택 , 컨설턴트 코치님 2차 사전 미팅, 기존 유사 서비스 조사 | 기존 유사 서비스 조사, Spring Security 로그인 학습 및 정리 | 백엔드 기술 스택 회의 및 결정 | 아이디어 차별성 구체화, React 메모이제이션 학습 | React 초기 프로젝트 구축 및 React Hooks 학습 | PM 특강, 스프링부트에서 JPA로 데이터 베이스 다루기 학습, BE 기술스택 회의 및 결정 | 아이디어 방향성 변경 및 구체화, 기존 유사 서비스 조사 |
| 1/16 | 사용자 워크플로우 제작, 프로젝트 세부 사항 회의 | 기술적 실현 가능성 분석 및 평가, Redis 개념 학습 | 아이디어 기술적 실현 가능성 분석 및 1차 컨펌 | FE 프로젝트 기본 개발환경 구축 및 1차 공유, 피그마 기반 코드작성 학습  | 3d 캐릭터 디자인 조사,React 속성 및 상태 학습 | 음성인식 테스트 코드 작성, 기술적 실현 가능성 분석 및 평가 | 기존 유사 서비스 조사, 프로젝트 구체화 및 설계 회의 |
| 1/17 |  | RefreshToken Redis 저장 방식 학습 | Jenkins 기초 학습 , 실험 세팅 | ESLint airbnb ts 규칙 적용, 타입스크립트 기초 학습 | React 배포 학습, 리액트(라이프사이클, 최적화 학습) | Redis 개념 학습 및 설치, ERD 구상 | React 기존 예제 프로젝트 학습 |
### Step2. Sub-PTJ 2
**[1월 20일 - 1월 24일]**
| **날짜** | **전체** | **구현진** | **박준현** | **윤지원** | **이하리** | **정은아** | **허정은** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/20 | 기능 명세서 작성 | 아이디어 주제 관련 조사, JPA 상속 관계 학습 | Docker 학습 , 아키텍쳐 조사 | 와이어프레임 설계 시작 | 스토리모드 메인 컴포넌트 설계 및 구현, 모드 선택 화면 UI/UX 개발, 싱글모드/함께모드 라우팅 구조 구현 | 사유결석(독감) | 아이디어 회의, Socket.io 공식 문서 학습 |
| 1/21 | 프로젝트 주제 회의 및 피드백 | 인프라 기획 및 컨펌, Spring Security 로그인 학습 | AWS 학습 및 인프라 기획 및 1차 컨펌 | 피그마 컴포넌트 생성 | 스토리 동화 삽화 생성 및 컴포넌트 개발, 반응형 레이아웃 구현, 기본 인터페이스 디자인 적용 | PM 특강, git branch, merge등 개념 학습, 인프라 기획 및 컨펌 | 아이디어 회의, Socket.io 공식 문서 학습 및 그림판 기능 개발 |
| 1/22 | 프로젝트 주제 최종 채택 , 컨설턴트 코치님 2차 사전 미팅, 기존 유사 서비스 조사 | 기존 유사 서비스 조사, Spring Security 로그인 학습 및 정리 | 백엔드 기술 스택 회의 및 결정 | 피그마 와이어프레임 완성 | 스토리 텍스트 데이터 구조화, 텍스트 컨텐츠 표시 시스템 구현, 스토리 진행 상태 관리 | PM 특강, 스프링부트에서 JPA로 데이터 베이스 다루기 학습, BE 기술스택 회의 및 결정 | Socket.io 연동 그림판 프로젝트 개발 |
| 1/23 | 사용자 워크플로우 제작, 프로젝트 세부 사항 회의 | 기술적 실현 가능성 분석 및 평가, Redis 개념 학습 | 아이디어 기술적 실현 가능성 분석 및 1차 컨펌 | 와이어프레임 기반 목업 디자인  | 오디오 플레이어 컴포넌트 개발, 음성 재생 제어 기능 구현, 오디오 상태 관리 시스템 구축 | 음성인식 테스트 코드 작성, 기술적 실현 가능성 분석 및 평가 | Fabric.js 기반 Socket.io 연동 그림판 프로젝트 개발 |
| 1/24 |  | RefreshToken Redis 저장 방식 학습 | Jenkins 기초 학습 , 실험 세팅 | 목업 마무리, 동화 각색, 관련 자료 수집 | 친구 초대 시스템 구현, 실시간 참여자 관리, 멀티플레이어 세션 관리 | Redis 개념 학습 및 설치, ERD 구상 | Canvas 기반 Socket.io 연동 그림판 프로젝트 고도화 |

### Step3. Sub-PTJ 2
**[1월 27일 - 1월 31일]**
| **날짜** | **전체** | **구현진** | **박준현** | **윤지원** | **이하리** | **정은아** | **허정은** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1/27 | 전체 | 아이디어 주제 관련 조사, JPA 상속 관계 학습 | Nginx 학습 | 공통 버튼 컴포넌트 개발  | 싱글모드 전용 삽화 시스템 구현, 페이지 전환 애니메이션 추가, 개인 진행 상태 저장 기능 | 사유결석(독감) | React와 Socket.io 임시 서버 연결 테스트 |
| 1/28 | 프로젝트 주제 회의 및 피드백 | 인프라 기획 및 컨펌, Spring Security 로그인 학습 | Openvidu 학습 및 튜토리얼 코드 테스트 | 키패드, 타이머 컴포넌트 개발 | 직관적인 페이지 전환 UI 구현, 네비게이션 컨트롤 최적화, 진행 상태 표시 기능 | PM 특강, git branch, merge등 개념 학습, 인프라 기획 및 컨펌 | React 기반 Socket.io 연동 canvas 기능 개발 |
| 1/29 | 프로젝트 주제 최종 채택 , 컨설턴트 코치님 2차 사전 미팅, 기존 유사 서비스 조사 | 기존 유사 서비스 조사, Spring Security 로그인 학습 및 정리 | JPA 학습 및 컨벤션 설정 | 공통 모달 컴포넌트 구현 | 싱글모드 전용 음성 재생 기능, 자동 재생 시스템 구현, 오디오 동기화 처리 | PM 특강, 스프링부트에서 JPA로 데이터 베이스 다루기 학습, BE 기술스택 회의 및 결정 | 다중 레이어 캔버스 생성, 이미지 저장 기능 추가, 디자인 수정 |
| 1/30 | 사용자 워크플로우 제작, 프로젝트 세부 사항 회의 | 기술적 실현 가능성 분석 및 평가, Redis 개념 학습 | 방화벽 설정, 배포 서버 DB 협업 설정 및 권한 부여  | 기타 공통 컴포넌트들 구현  | 함께모드 전용 삽화 시스템, 실시간 페이지 동기화, 참여자 간 화면 공유 | 음성인식 테스트 코드 작성, 기술적 실현 가능성 분석 및 평가 | 실시간 연동 canvas에 비율에 따른 좌표 적용, 그리기 화면 개발 |
| 1/31 |  | RefreshToken Redis 저장 방식 학습 | EC2 Docker Jenkins , Git Lab 연결 | TailwindCSS 제대로 적용되지 않는 문제 해결 | 함께모드 전용 음성 재생 시스템, 참여자 간 오디오 동기화, 실시간 재생 상태 공유 | Redis 개념 학습 및 설치, ERD 구상 | canvas 연동 오류 수정 및 도안 데이터 생성 |

### Step4. Sub-PTJ 3
**[2월 3일 - 2월 7일]**
| **날짜** | **전체** | **구현진** | **박준현** | **윤지원** | **이하리** | **정은아** | **허정은** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2/3 | 프로젝트 주제 회의 및 피드백, 컨설턴트 코치님 1차 사전 미팅 | 아이디어 주제 관련 조사, JPA 상속 관계 학습 | 배포환경 Spring 설정 및 배포 | 부모 회원가입, 로그인 기능 구현  | 내레이션 자동 재생, 스토리 함께모드 페이지 넘김 처리, 권한 기반 기능 제어 | 사유결석(독감) | 그리기 및 친구 선택 Zustand 상태 관리 적용, Socket.io 기능 분리 |
| 2/4 | 프로젝트 주제 회의 및 피드백 | 인프라 기획 및 컨펌, Spring Security 로그인 학습 | Nginx로 프론트엔드 배포, SSL/TLS 적용 | 서브 계정 생성 폼 구현 | 스토리 함께모드 녹음 기능 추가, role1/role2 구분 및 할당, 역할별 대사 표시 시스템 | PM 특강, git branch, merge등 개념 학습, 인프라 기획 및 컨펌 | 보호자 리포트 화면 생성, canvas에 상태에 따른 socket 연결 상태 관리 |
| 2/5 | 프로젝트 주제 최종 채택 , 컨설턴트 코치님 2차 사전 미팅, 기존 유사 서비스 조사 | 기존 유사 서비스 조사, Spring Security 로그인 학습 및 정리 | Jenkins - 백엔드, 프론트엔드 CI/CD 구축 | 친구 목록 및 추가 컴포넌트 개발 | MediaRecorder API를 활용한 녹음 기능, 스토리 함께모드 역할 배정 기능 추가, 역할 배정 기능 수정 | PM 특강, 스프링부트에서 JPA로 데이터 베이스 다루기 학습, BE 기술스택 회의 및 결정 | 저장 및 생성 이미지 형식 webp로 수정 |
| 2/6 | 사용자 워크플로우 제작, 프로젝트 세부 사항 회의 | 기술적 실현 가능성 분석 및 평가, Redis 개념 학습 | 배포환경 Redis 설정, Jenkins 보안 설정 | 부모/자식 API 헤더 토큰 적용 우선순위 로직 수정 | 역할별 턴 관리 시스템, 스토리 함께모드 오픈비두 기능 추가, 라이브킷 라이브러리 비디오, 오디오 스트리밍 구현 | 음성인식 테스트 코드 작성, 기술적 실현 가능성 분석 및 평가 | 나의 집 디자인 수정 |
| 2/7 |  | RefreshToken Redis 저장 방식 학습 | Openvidu 배포 , 인프라 점검 | 친구 관련 기능 API 연결 | 참가자별 비디오 스트림 처리 및 표시, 실시간 동기화 구현, 참가자 간 동기화된 페이지 전환 | Redis 개념 학습 및 설치, ERD 구상 | 동화 페이지 Zustand 적용 및 화면 전환 로직 수정 |

### Step5. Sub-PTJ 3
**[2월 10일 - 2월 14일]**
| **날짜** | **전체** | **구현진** | **박준현** | **윤지원** | **이하리** | **정은아** | **허정은** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2/10 | 프로젝트 주제 회의 및 피드백, 컨설턴트 코치님 1차 사전 미팅 | 아이디어 주제 관련 조사, JPA 상속 관계 학습 | SocketIO 설정 및 메인 컨텐츠 저장 기능 개발 | Protected Routing 적용, 로그인 로그아웃 오류 수정  | 내레이션 자동 재생, 스토리 함께모드 페이지 넘김 처리, 권한 기반 기능 제어 | 사유결석(독감) | 그리기 결과 S3 업로드 및 조회 기능 구현, 편지 저장 및 조회 기능 구현 |
| 2/11 | 프로젝트 주제 회의 및 피드백 | 인프라 기획 및 컨펌, Spring Security 로그인 학습 | 동화 함께 읽기 개발 | FCM 알림 통한 함께하기 기능 구현 | 스토리 함께모드 녹음 기능 추가, role1/role2 구분 및 할당, 역할별 대사 표시 시스템 | PM 특강, git branch, merge등 개념 학습, 인프라 기획 및 컨펌 | STT 기능 연결 및 오디오 S3 저장 및 조회 기능 구현, 그림 목록 API 연결 |
| 2/12 | 프로젝트 주제 최종 채택 , 컨설턴트 코치님 2차 사전 미팅, 기존 유사 서비스 조사 | 기존 유사 서비스 조사, Spring Security 로그인 학습 및 정리 | 동화 함께 읽기 개발 | FCM 알림 통한 함께하기 기능 구현 | MediaRecorder API를 활용한 녹음 기능, 스토리 함께모드 역할 배정 기능 추가, 역할 배정 기능 수정 | PM 특강, 스프링부트에서 JPA로 데이터 베이스 다루기 학습, BE 기술스택 회의 및 결정 | 동화 목록 API 연결, 편지 알림 화면 생성 |
| 2/13 | 사용자 워크플로우 제작, 프로젝트 세부 사항 회의 | 기술적 실현 가능성 분석 및 평가, Redis 개념 학습 | 동화 함께 읽기 개발 | FCM 초대 openVidu, Socket으로 연결 | 역할별 턴 관리 시스템, 스토리 함께모드 오픈비두 기능 추가, 라이브킷 라이브러리 비디오, 오디오 스트리밍 구현 | 음성인식 테스트 코드 작성, 기술적 실현 가능성 분석 및 평가 | 동화 저장 기능 개발 |
| 2/14 |  | RefreshToken Redis 저장 방식 학습 | 참가자별 비디오 스트림 처리 및 표시, 실시간 동기화 구현, 참가자 간 동기화된 페이지 전환 | 그리기 연동, 친구 목록 동기화 해결 | 참가자별 비디오 스트림 처리 및 표시, 실시간 동기화 구현, 참가자 간 동기화된 페이지 전환 | Redis 개념 학습 및 설치, ERD 구상 | 디자인 개선 및 QA |

### Step6. Sub-PTJ 3
**[2월 17일 - 2월 21일]**
| **날짜** | **전체** | **구현진** | **박준현** | **윤지원** | **이하리** | **정은아** | **허정은** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2/17 | 프로젝트 주제 회의 및 피드백, 컨설턴트 코치님 1차 사전 미팅 | 아이디어 주제 관련 조사, JPA 상속 관계 학습 | 메인 컨텐츠 동기화 오류 수정 | 토큰 만료시 재로그인 로직 추가, Story 진행 관련 Store 생성  | 함께모드 녹음기능 수정, 인사페이지 구현, 시각적 카운트다운 구현 | 사유결석(독감) | 그리기 및 읽기 참여기록 데이터 생성 기능 연결 |
| 2/18 | 프로젝트 주제 회의 및 피드백 | 인프라 기획 및 컨펌, Spring Security 로그인 학습 | 메인 컨텐츠 그리기 연동및 수정 | CSS 수정 및 발표 준비 시작 | 인사페이지 마이크 수정, 실시간 준비 상태 동기화, 인사페이지 녹음 기능 수정 | PM 특강, git branch, merge등 개념 학습, 인프라 기획 및 컨펌 | 동화 음성 저장 및 조회 기능 개발 |
| 2/19 | 프로젝트 주제 최종 채택 , 컨설턴트 코치님 2차 사전 미팅, 기존 유사 서비스 조사 | 기존 유사 서비스 조사, Spring Security 로그인 학습 및 정리 | 메인컨텐츠 모드 별 화면분리, QA | sketch, book path 오류 해결, 발표 장표 준비 | 동화/인사 모드에 따른 화면 레이아웃 전환, 자막위치, 크기, 폰트 수정, 페이지 넘김 오류 수정 | PM 특강, 스프링부트에서 JPA로 데이터 베이스 다루기 학습, BE 기술스택 회의 및 결정 | 동화 읽기 내역 및 다시보기 개발, QA |
| 2/20 | 사용자 워크플로우 제작, 프로젝트 세부 사항 회의 | 기술적 실현 가능성 분석 및 평가, Redis 개념 학습 | 영상 촬영, QA | 리드미 작성 및 발표 준비  | 녹음완료후 페이지 넘기 처리 오류 수정, 화상비디오 크기조절 및 하이라이트 기능 추가 | 음성인식 테스트 코드 작성, 기술적 실현 가능성 분석 및 평가 | 동화 페이지에 그림 반영 기능 개발, QA |
| 2/21 |  | RefreshToken Redis 저장 방식 학습 | 시연 연습 및 시연 | ESLint airbnb ts 규칙 적용, 타입스크립트 기초 학습 | 인사페이지 스타일 수정, 함께모드 페이지 스타일 수정 | Redis 개념 학습 및 설치, ERD 구상 |  |