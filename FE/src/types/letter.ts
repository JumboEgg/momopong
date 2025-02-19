export interface LetterInfo {
    bookTitle: string; // 책 이름
    role: string; // 답장할 인물
    childName: string; // 편지를 보내는 어린이
    content: string; // 편지 내용
    letterFileName: string; // 음성 파일 S3
    letterUrl: string; // 음성 파일 S3
    reply: string; // 등장인물 답변
    createdAt: string; // 편지 전송 시간
}

export interface LetterData extends LetterInfo {
    bookPath: string;
}

export interface GPTRequest {
    fairyTale: string;
    role: string;
    childName: string;
    content: string;
    letterRecord?: string;
}
