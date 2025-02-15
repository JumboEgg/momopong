import { useRecordList } from '@/stores/book/bookRecordListStore';
import { useDrawing } from '@/stores/drawing/drawingStore';
import { useRoleStore } from '@/stores/roleStore';
import { BookParticiPationRecordData, PageRecordData } from '@/types/book';
import { DrawingParticipationRecordData } from '@/types/sketch';
import makeBookRecord from '@/utils/bookS3/bookRecordCreate';
import endBookRecordSession from '@/utils/bookS3/bookRecordEnd';
import makeDrawingRecord from '@/utils/drawingS3/drawingRecordCreate';
import endDrawingSession from '@/utils/drawingS3/drawingRecordEnd';
import { useNavigate } from 'react-router-dom';

function BookRecordPage() {
  const navigate = useNavigate();
    const {
        addRecord, uploadRecord,
    } = useRecordList();

    const {
      sessionId, setSessionId,
    } = useDrawing();

    const pageData: PageRecordData = {
        bookRecordId: 1,
        partnerBookRecordId: 0,
        bookRecordPageNumber: 0,
        pagePath: '',
        audioPath: '',
        role: 'role1',
        text: '',
        audioNumber: 0,
    };

    // TODO : roleStore에 저장된 데이터로 교체
    const inviterId = 4;

    const bookSessionData: BookParticiPationRecordData = {
      childId: inviterId,
      bookId: 1,
      role: useRoleStore.getState().inviterRole ?? '',
      mode: 'MULTI',
    };

    const sketchSessionData: DrawingParticipationRecordData = {
      childId: inviterId,
      mode: 'SINGLE',
    };

    const startSketchSession = async () => {
      const id = await makeDrawingRecord(sketchSessionData);
      setSessionId(id);
    };

    const endSketchSession = () => {
      if (!sessionId) {
        console.log('session id is null');
        return;
      }
      endDrawingSession(sessionId);
    };

    const audio = new Blob();
    return (
      <div className="flex flex-col justify-center items-center space=y-10">
        <button type="button" onClick={() => makeBookRecord(bookSessionData)}>
          bookRecord 시작
        </button>
        <button type="button" onClick={() => endBookRecordSession(1)}>
          bookRecord 끝내기
        </button>
        <button type="button" onClick={() => addRecord(pageData, audio)}>
          오디오 정보 저장
        </button>
        <button type="button" onClick={() => uploadRecord()}>
          페이지 정보 업로드
        </button>
        <button type="button" onClick={startSketchSession}>
          sketchRecord 시작
        </button>
        <button type="button" onClick={endSketchSession}>
          sketchRecord 끝내기
        </button>
        <button type="button" onClick={() => navigate('/book/letter')}>편지 남기기</button>
        <button type="button" onClick={() => navigate('/home')}>홈으로 가기</button>
      </div>
    );
}

export default BookRecordPage;
