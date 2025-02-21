export interface ActivityAnalysisInfo {
    readingMinutes: number;
    readingMinutesSingle: number;
    readingMinutesMulti: number;
    sketchingMinutesSingle: number;
    sketchingMinutesMulti: number;
    thisMonthMinutes: number;
    thisWeekMinutes: number;
    lastWeekMinutes: number;
    earlyExitCount: number;
}

export interface ActivityHistoryInfo {
    bookTitle: string;
    bookPath: string;
    readCount: number;
}
