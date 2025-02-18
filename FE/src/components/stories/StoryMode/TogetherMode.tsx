// 수정한거임
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useStory } from '@/stores/storyStore';
import { useFriends } from '@/stores/friendStore';
import useSubAccountStore from '@/stores/subAccountStore';
import { useBookContent } from '@/stores/book/bookContentStore';
import makeBookRecord from '@/utils/bookS3/bookRecordCreate';
import { BookParticiPationRecordData, PageRecordData } from '@/types/book';
import { useRoleStore } from '@/stores/roleStore';
import endBookRecordSession from '@/utils/bookS3/bookRecordEnd';
import { useRecordList } from '@/stores/book/bookRecordListStore';
import IntegratedRoom from './IntegratedRoom';
import AudioPlayer from '../AudioPlayer';
import StoryIllustration from './StoryIllustration';
import storyData from '../data/cinderella';
// import { getAudioUrl } from '../utils/audioUtils';

interface LocationState {
  roomName: string;
  participantName: string;
  userRole: 'role1' | 'role2';
}

interface RecordingState {
  [participantId: string]: {
    isRecording: boolean;
    isCompleted: boolean;
  };
}

function TogetherMode() {
  const location = useLocation();
  const { roomName } = location.state as LocationState;
  const { friend } = useFriends();
  const { bookContent } = useBookContent();
  const selectedAccount = useSubAccountStore((state) => state.selectedAccount);
  const {
    bookId,
    currentIndex, setCurrentIndex,
    audioEnabled,
    bookRecordId, setBookRecordId,
  } = useStory();

  const {
    inviterId,
    role1UserId,
    role2UserId,
    role1RecordId, setRole1RecordId,
    role2RecordId, setRole2RecordId,
  } = useRoleStore();

  const {
    addRecord, uploadRecord,
  } = useRecordList();

 // TogetherMode.tsx
  const myId = useSubAccountStore.getState().selectedAccount?.childId ?? 0;

  const determineUserRole = (userId: number) => {
    // 디버깅을 위한 로그 추가
    console.log('역할 결정 디버깅:', {
      userId,
      inviterId,
      isInviter: userId === inviterId,
      assignedRole: userId === inviterId ? 'role1' : 'role2',
    });

    return userId === inviterId ? 'role1' : 'role2';
  };

  const myRole = useMemo(() => {
    const role = determineUserRole(myId);
    console.log('최종 결정된 역할:', {
      myId,
      role,
      inviterId,
    });
    return role;
  }, [myId, inviterId]);

  // 상태 관리
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [recordingStates, setRecordingStates] = useState<RecordingState>({});
  const [isWaitingForOther, setIsWaitingForOther] = useState(false);

  // 현재 페이지 및 컨텐츠 계산
  const currentPage = bookContent?.pages[currentIndex];
  const currentContent = currentPage?.audios[currentContentIndex];

  // 읽기 기록 생성 여부 확인
  const isRecording = useRef(false);

  // 녹음
  const recordBlob = useRef<Blob | null>(null);

  // 읽기 기록 저장
  const saveReadingSession = async () => {
    if (inviterId !== myId) return;

    // role1 사용자의 DB 생성
    const role1Data: BookParticiPationRecordData = {
      childId: role1UserId ?? 0,
      bookId: bookId ?? 0,
      role: bookContent?.role1 ?? 'role1',
      mode: 'MULTI',
    };
    const role1Id = await makeBookRecord(role1Data);
    if (role1UserId === myId) setBookRecordId(role1Id);
    setRole1RecordId(role1Id);

    // role2 사용자의 DB 생성
    const role2Data: BookParticiPationRecordData = {
      childId: role2UserId ?? 0,
      bookId: bookId ?? 0,
      role: bookContent?.role2 ?? 'role2',
      mode: 'MULTI',
    };
    const role2Id = await makeBookRecord(role2Data);
    if (role1UserId === myId) setBookRecordId(role2Id);
    setRole2RecordId(role2Id);
  };

  // useEffect(() => {
  //   // 역할 초기 설정
  //   // const randomRole = Math.random() < 0.5 ? 'role2' : 'role1';
  //   // setUserRole(randomRole);

  //   // roleStore에 저장된 역할 배정
  //   if (role1UserId === myId) {
  //     setUserRole('role1');
  //   } else setUserRole('role2');

  //   // 읽기 시작 시 도서 읽기 정보 저장
  //   if (isRecording.current) return;
  //   isRecording.current = true;
  //   saveReadingSession();
  // }, []);

  // 읽기 정보 저장을 위한 useEffect만 남김
  useEffect(() => {
    if (isRecording.current) return;
    isRecording.current = true;
    saveReadingSession();
  }, []);

  // 현재 사용자 차례 확인
  const isUserTurn = useMemo(() => {
    if (!myRole || !currentContent) return false;
    return currentContent.role === myRole;
  }, [myRole, currentContent]);

  useEffect(() => {
    if (!currentPage) return;
    uploadRecord();
  }, [currentIndex]);

  // 다음 페이지/컨텐츠로 이동
  const handleNext = useCallback(() => {
    if (!currentPage) return;

    // 녹음 상태 초기화
    setRecordingStates({});
    setIsWaitingForOther(false);

    if (currentContentIndex < currentPage.audios.length - 1) {
      setCurrentContentIndex((prev) => prev + 1);
    } else if (currentIndex < storyData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentContentIndex(0);
    } else {
      // 읽기 종료 시 읽기 기록 정보 갱신
      endBookRecordSession(bookRecordId ?? 0);
    }
  }, [currentIndex, currentContentIndex, currentPage, setCurrentIndex]);

  // 녹음 상태 변경 처리
  const handleRecordingStateChange = useCallback(
    (participantId: string, status: 'idle' | 'recording' | 'completed') => {
      setRecordingStates((prev) => ({
        ...prev,
        [participantId]: {
          isRecording: status === 'recording',
          isCompleted: status === 'completed',
          audio: null,
        },
      }));
    },
    [],
  );

  // 오디오 정보 저장
  const addAudioToList = (audioBlob: Blob | null) => {
    console.log(`page: ${currentPage?.pageNumber ?? 1}, audio: ${currentContent?.order ?? 1}`);
    // 저장할 데이터
    const pageData: PageRecordData = {
        bookRecordId: role1RecordId ?? 0,
        partnerBookRecordId: role2RecordId ?? 0,
        bookRecordPageNumber: currentPage?.pageNumber ?? 1,
        pagePath: currentPage?.pagePath ?? '',
        audioPath: currentContent?.path ?? '',
        role: currentContent?.role ?? 'narration',
        text: currentContent?.text ?? '',
        audioNumber: currentContent?.order ?? 1,
    };
    addRecord(pageData, audioBlob);
  };

  // 내레이션 오디오 완료 처리
  const handleNarrationComplete = useCallback(() => {
    if (currentContent?.role === 'narration') {
      addAudioToList(null);
    } else if (currentContent?.role === myRole) {
      addAudioToList(recordBlob.current);
    }
    handleNext();
  }, [handleNext]);

  // 모든 참가자의 녹음 완료 여부 확인
  useEffect(() => {
    const allParticipantsCompleted = Object
    .values(recordingStates)
    .every((state) => state.isCompleted);

    // 최소한 한 명이 녹음을 완료했고, 모든 참가자가 완료했을 때
    if (allParticipantsCompleted && Object.keys(recordingStates).length > 0) {
      handleNarrationComplete();

      // 녹음 상태 초기화
      setRecordingStates({});
      setIsWaitingForOther(false);
    }
  }, [recordingStates, currentIndex, currentContentIndex, currentPage]);

  const handleRecordingComplete = useCallback((participantId: string, audioBlob?: Blob) => {
    // 녹음된 오디오 blob 처리
    console.log('녹음 완료:', participantId, audioBlob);
    recordBlob.current = audioBlob ?? null;

    // 녹음 상태 업데이트
    setRecordingStates((prev) => ({
      ...prev,
      [participantId]: {
        isRecording: false,
        isCompleted: true,
      },
    }));

      // 대기 상태 설정
      setIsWaitingForOther(true);
    }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    console.log('RecordingStates 변경됨:', recordingStates);

    // 각 상태의 세부 정보 로깅
    Object.entries(recordingStates).forEach(([key, value]) => {
      console.log(
        `참가자 ${key} 상태:`,
        `녹음 중: ${value.isRecording}, 
        완료: ${value.isCompleted}`,
      );
    });

    const allParticipantsCompleted = Object
      .values(recordingStates)
      .every((state) => state.isCompleted);

    const participantCount = Object.keys(recordingStates).length;

    console.log(`모든 참가자 완료: ${allParticipantsCompleted}`);
    console.log(`참가자 수: ${participantCount}`);

    if (allParticipantsCompleted && participantCount > 0) {
      console.log('페이지 넘어가기 시도');

      // 안전장치 추가
      const timeoutId = setTimeout(() => {
        handleNarrationComplete();
        setRecordingStates({});
        setIsWaitingForOther(false);
      }, 100); // 짧은 지연 추가

      return () => clearTimeout(timeoutId);
    }
  }, [recordingStates, currentIndex, currentContentIndex, currentPage]);

  return (
    <div className="w-full h-screen relative">
      {/* 동화 컨텐츠 영역 */}
      <div className="w-full h-full px-6 pb-48 pt-6">
        <div className="mb-6 hidden">
          <h2 className="text-2xl font-bold text-gray-800">함께 읽는 신데렐라</h2>
          <p className="text-gray-600">
            내 역할:
            {myRole === 'role2' ? '왕자님' : '신데렐라'}
          </p>
          <p className="text-gray-600">
            함께 읽는 친구:
            {friend?.name || ''}
            {friend && ` (${myRole === 'role1' ? '왕자님' : '신데렐라'})`}
          </p>
        </div>

        <StoryIllustration
          pageNumber={currentPage?.pageNumber ?? 0}
          currentContentIndex={currentContentIndex}
          onPrevious={() => {
            if (currentIndex > 0) {
              setCurrentIndex(currentIndex - 1);
              setCurrentContentIndex(0);
            }
          }}
          onNext={handleNext}
          isFirst={currentIndex === 0}
          isLast={currentIndex === storyData.length - 1}
          userRole={myRole || undefined}
          currentContent={currentContent}
          illustration={currentPage?.pagePath ?? ''}
        />

        {/* 녹음 대기 상태 표시 */}
        {isWaitingForOther && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-6 py-3 rounded-full shadow-lg">
            상대방의 녹음이 끝날 때까지 기다려주세요...
          </div>
        )}

        {/* 오디오 플레이어 (내레이션) */}
        {currentContent?.role === 'narration' && audioEnabled && currentContent.order && (
          <div className="hidden">
            <AudioPlayer
              audioFiles={[currentContent.path ?? '']}
              autoPlay
              onEnded={handleNarrationComplete}
              onError={() => {
                console.error('Audio playback failed');
                handleNext();
              }}
            />
          </div>
        )}
      </div>

      {/* 화상 비디오 영역 */}
      {myRole && (
        <IntegratedRoom
          roomName={roomName}
          participantName={selectedAccount?.name || 'Anonymous'}
          userRole={myRole}
          isUserTurn={isUserTurn}
          onRecordingComplete={handleRecordingComplete}
          onRecordingStatusChange={(participantId: string, status) => {
            handleRecordingStateChange(participantId, status);
          }}
        />
      )}
    </div>
  );
}

export default TogetherMode;
