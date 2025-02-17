export interface BookItemInfo {
    bookId: number;
    title: string;
    bookPath: string; // 책 표지 경로로
}

type CharacterType = 'narration' | 'role1' | 'role2';

export interface BookAudioInfo {
    order: number; // 페이지 내 오디오 순서
    role: CharacterType; // 역할. 역할 구분 interface가 있다면 적용
    text: string; // 대사
    path: string; // 오디오 S3 경로
}

interface PagePosition {
    sketchPath: string;
    x: number;
    y: number;
    ratio: number;
    angle: number;
}

export interface PageInfo {
    pageId: number;
    pageNumber: number;
    pagePath: string; // 페이지 이미지 경로
    audios: BookAudioInfo[]
    position: PagePosition;
    hasDrawing: boolean;
    hasObject: boolean;
}

export interface BookContentInfo {
    bookId: number;
    bookTitle: string;
    totalPage: number;
    role1: string;
    role2: string;
    sketch: string; // 책 내에서 사용할 도안 경로
    pages: PageInfo[];
}

export interface BookParticiPationRecordData {
    childId: number;
    bookId: number;
    role: string;
    mode: string,
}

export interface BookParticipationRecordInfo {
    bookRecordId: number;
    childId: number;
    bookId: number;
    role: string;
    startTime: string;
    endTime: string;
    mode: string;
}

export interface PageRecordData {
    bookRecordId: number;
    partnerBookRecordId: number;
    bookRecordPageNumber: number;
    pagePath: string;
    audioPath: string;
    role: string;
    text: string;
    audioNumber: number;
}
