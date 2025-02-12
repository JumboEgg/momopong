export interface BookItemInfo {
    bookId: number;
    title: string;
    bookPath: string; // 책 표지 경로로
}

interface BookAudioInfo {
    order: number; // 페이지 내 오디오 순서
    role: string; // 역할. 역할 구분 interface가 있다면 적용
    text: string; // 대사
    path: string; // 오디오 S3 경로
}

interface PageInfo {
    pageId: number;
    pageNumber: number;
    pagePath: string; // 페이지 이미지 경로
    audios: BookAudioInfo[]
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
