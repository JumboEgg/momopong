import { useRecordList } from '@/stores/book/recordListStore';
import { PageRecordData } from '@/types/book';
import makeBookRecord from '@/utils/bookS3/bookRecordCreate';
import endBookRecordSession from '@/utils/bookS3/bookRecordEnd';

function BookRecordPage() {
    const {
        addRecord, uploadRecord,
    } = useRecordList();

    const pageData: PageRecordData = {
        bookRecordId: 0,
        partnerBookRecordId: 0,
        bookRecordPageNumber: 0,
        pagePath: '',
        audioPath: '',
        role: '',
        text: '',
        audioNumber: 0,
    };

    const audio = new Blob();
    return (
      <div className="flex flex-col justify-center items-center space=y-10">
        <button type="button" onClick={() => makeBookRecord(2, 'MULTI')}>
          bookRecord 시작
        </button>
        <button type="button" onClick={endBookRecordSession}>
          bookRecord 끝내기
        </button>
        <button type="button" onClick={() => addRecord(pageData, audio)}>
          오디오 정보 저장
        </button>
        <button type="button" onClick={() => uploadRecord()}>
          페이지 정보 업로드
        </button>
      </div>
    );
}

export default BookRecordPage;
