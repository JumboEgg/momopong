import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStory } from '@/stores/storyStore';
import { useFriends } from '@/stores/friendStore';
import useSubAccountStore from '@/stores/subAccountStore';
import { useBookContent } from '@/stores/book/bookContentStore';
import makeBookRecord from '@/utils/bookS3/bookRecordCreate';
import { useRoomStore } from '@/stores/roomStore';
import { BookParticiPationRecordData, PageRecordData } from '@/types/book';
import { useRoleStore } from '@/stores/roleStore';
import endBookRecordSession from '@/utils/bookS3/bookRecordEnd';
import { useRecordList } from '@/stores/book/bookRecordListStore';
import StoryDrawingPage from '@/components/drawing/drawingMode/StoryDrawingPage';
import IntegratedRoom from './IntegratedRoom';
import AudioPlayer from '../AudioPlayer';
import StoryIllustration from './StoryIllustration';
import storyData from '../data/cinderella';

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
    currentAudioIndex, setCurrentAudioIndex,
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
    setPageImage,
  } = useRecordList();

  const { room, setRoom } = useRoomStore();

  const navigate = useNavigate();

  const [isDrawingMode, setIsDrawingMode] = useState(false);

  // inviter/invitee 구분용 id 정보
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
  // const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [recordingStates, setRecordingStates] = useState<RecordingState>({});
  // const [isWaitingForOther, setIsWaitingForOther] = useState(false);
  const [isProcessingRecording, setIsProcessingRecording] = useState(false);

  // 현재 페이지 및 컨텐츠 계산
  const currentPage = bookContent?.pages[currentIndex];
  const currentContent = currentPage?.audios[currentAudioIndex];

  // 읽기 기록 생성 여부 확인
  const isRecording = useRef(false);

  // 녹음
  const recordBlob = useRef<Blob | null>(null);

  const handleRecordIdReceived = useCallback((recordData: { role1Id: number, role2Id: number }) => {
    console.log('Received record IDs:', recordData);
    // 모든 참가자가 두 recordId를 모두 저장
    setRole1RecordId(recordData.role1Id);
    setRole2RecordId(recordData.role2Id);

    // 자신의 역할에 맞는 bookRecordId 설정
    if (myRole === 'role1') {
      setBookRecordId(recordData.role1Id);
    } else if (myRole === 'role2') {
      setBookRecordId(recordData.role2Id);
    }
  }, [myRole, setBookRecordId, setRole1RecordId, setRole2RecordId]);

  const handleBookCompletion = useCallback(async () => {
    await endBookRecordSession(bookRecordId ?? 0);

    if (room) {
      console.log('Disconnecting from room');
      await room.disconnect();
      setRoom(null);
    }

    console.log('Navigating to letter page');
    navigate('/book/letter');
  }, [bookRecordId, room, setRoom, navigate]);

  // 읽기 기록 저장
  const saveReadingSession = async () => {
    if (inviterId !== myId) {
      return { role1Id: 0, role2Id: 0 };
    }
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
    if (role2UserId === myId) setBookRecordId(role2Id);
    setRole2RecordId(role2Id);
    return { role1Id, role2Id };
  };

  // 읽기 정보 저장을 위한 useEffect만 남김
  useEffect(() => {
    if (isRecording.current) return;
    isRecording.current = true;
    saveReadingSession();

    // 첫 페이지 이미지 저장
    if (!bookContent?.pages[0]) return;
    setPageImage(bookContent?.pages[0]);
  }, []);

  // 현재 사용자 차례 확인
  const isUserTurn = useMemo(() => {
    if (!myRole || !currentContent) return false;
    return currentContent.role === myRole;
  }, [myRole, currentContent]);

  useEffect(() => {
    console.log('handleNext 호출됨', {
      currentIndex,
      currentAudioIndex,
      hasDrawing: currentPage?.hasDrawing,
      totalStoryDataPages: storyData.length,
      totalBookContentPages: bookContent?.pages.length,
    });

    if (!currentPage) return;
    uploadRecord();
    setPageImage(currentPage);
  }, [currentIndex]);

  // 다음 페이지/컨텐츠로 이동
  const handleNext = useCallback(() => {
    const totalPages = bookContent?.pages?.length || 0;

    console.log('handleNext 실행 상세 정보:', {
      currentIndex,
      currentAudioIndex,
      hasDrawing: currentPage?.hasDrawing,
      totalStoryDataPages: storyData.length,
      totalBookContentPages: totalPages,
      bookContentLoaded: !!bookContent,
    });

    if (!currentPage) return;
    // 모든 상태 초기화 추가
    setRecordingStates({});
    // setIsWaitingForOther(false);
    setIsProcessingRecording(false);
    setIsDrawingMode(false); // 드로잉 모드도 초기화

    // 페이지 내 다음 오디오로
    if (currentAudioIndex < currentPage.audios.length - 1) {
      console.log(`같은 페이지 내 다음 오디오로: ${currentAudioIndex} → ${currentAudioIndex + 1}`);
      setCurrentAudioIndex(currentAudioIndex + 1);
    } else if (currentIndex < Math.min(totalPages, storyData.length) - 1) {
      const nextIndex = currentIndex + 1;
      console.log(`다음 페이지로 이동: ${currentIndex} → ${nextIndex}`);
      setCurrentIndex(nextIndex);
      setCurrentAudioIndex(0);
    } else {
      console.log('모든 페이지 완료, 종료');
      handleBookCompletion();
    }

    // if (currentContentIndex < currentPage.audios.length - 1) {
    //   setCurrentContentIndex((prev) => prev + 1);
    // } else if (currentIndex < storyData.length - 1) {
    //   setCurrentIndex(currentIndex + 1);
    //   setCurrentContentIndex(0);
    // } else {
    //   // 읽기 종료 시 읽기 기록 정보 갱신
    //   endBookRecordSession(bookRecordId ?? 0);
    //   navigate('/book/letter');
    // }
  }, [currentIndex, currentAudioIndex, currentPage, setCurrentIndex, bookRecordId]);

  // 오디오 정보 저장
  const addAudioToList = (audioBlob: Blob | null) => {
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
    console.log('내레이션 완료 처리 시작', {
      contentRole: currentContent?.role,
      myRole,
      hasRecordBlob: !!recordBlob.current,
    });

    if (inviterId === myId && currentContent?.role === 'narration') {
      addAudioToList(null);
    } else if (currentContent?.role === myRole) {
      addAudioToList(recordBlob.current);
    }

    console.log('드로잉 모드 확인:', {
      pageNumber: currentPage?.pageNumber,
      hasDrawing: !!currentPage?.hasDrawing, // 명시적 boolean 변환
      sketchPath: !!currentPage?.position?.sketchPath, // 스케치 경로 존재 여부도 확인
    });

    // 현재 페이지에 드로잉이 있는 경우
    if (currentPage?.hasDrawing && currentAudioIndex === currentPage.audios.length - 1) {
      setTimeout(() => {
      setIsDrawingMode(true);
      }, 100);
    } else {
      // 드로잉이 없는 경우에만 다음으로 진행
      setTimeout(() => {
        handleNext();
      }, 100);
    }
  }, [currentContent, currentPage, myRole, addAudioToList, handleNext]);

  // 모든 참가자의 녹음 완료 여부 확인
  useEffect(() => {
    // console.log('녹음 상태 변경:', {
    //   recordingStates,
    //   isProcessingRecording,
    //   participantCount: Object.keys(recordingStates).length,
    // });

    const allParticipantsCompleted = Object
      .values(recordingStates)
      .every((state) => state.isCompleted);

    if (allParticipantsCompleted
      && Object.keys(recordingStates).length > 0
      && !isProcessingRecording) {
      setIsProcessingRecording(true);

      setTimeout(() => {
        handleNarrationComplete();
      }, 100);
    }
  }, [recordingStates, handleNarrationComplete, isProcessingRecording]);

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
    // setIsWaitingForOther(true);
  }, []);

  const handleRecordingStateChange = useCallback(
    (participantId: string, status: 'idle' | 'recording' | 'completed') => {
      setRecordingStates((prev) => ({
        ...prev,
        [participantId]: {
          isRecording: status === 'recording',
          isCompleted: status === 'completed',
        },
      }));
    },
    [],
  );

  return (
    <div className="w-full h-screen relative">
      {/* 동화 컨텐츠 영역 */}
      <div className={`w-full h-full ${isDrawingMode ? 'hidden' : ''}`}>
        <div className="mb-6 hidden px-6 pb-48 pt-6 ">
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
          currentContentIndex={currentAudioIndex}
          onPrevious={() => {
            if (currentIndex > 0) {
              setCurrentIndex(currentIndex - 1);
              setCurrentAudioIndex(0);
            }
          }}
          onNext={handleNext}
          isFirst={currentIndex === 0}
          isLast={currentIndex === storyData.length - 1}
          userRole={myRole || undefined}
          currentContent={currentContent}
          illustration={currentPage?.pagePath ?? ''}
          hasObject={currentPage?.hasObject ?? false}
          position={currentPage?.position}
        />

        {/* 녹음 대기 상태 표시 */}
        {/* {isWaitingForOther && (
          <div className="fixed
           top-4 left-1/2 transform -translate-x-1/2
           bg-blue-100 text-blue-800 px-6 py-3 rounded-full shadow-lg"
          >
            상대방의 녹음이 끝날 때까지 기다려주세요...
          </div>
        )} */}

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
        <div className="fixed bottom-4 w-64 h-48 z-[60]">
          <IntegratedRoom
            roomName={roomName}
            participantName={selectedAccount?.name || 'Anonymous'}
            userRole={myRole}
            isUserTurn={isUserTurn}
            onRecordingComplete={handleRecordingComplete}
            onRecordingStatusChange={handleRecordingStateChange}
            onRecordIdReceived={handleRecordIdReceived}
            role1RecordId={role1RecordId}
            role2RecordId={role2RecordId}
            isHost={inviterId === myId}
            variant={isDrawingMode ? 'drawing' : 'story'}
          />
        </div>
      )}

      {/* 드로잉 모드 */}
      {isDrawingMode && (
        <div className="absolute inset-0 z-50">
          <StoryDrawingPage roomName={roomName} userRole={myRole} handleNext={handleNext} />
        </div>
      )}
    </div>
  );
}

export default TogetherMode;
