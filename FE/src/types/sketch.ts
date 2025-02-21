export interface SketchInfo {
  sketchId: number;
  sketchPath: string;
  sketchTitle: string;
}

export interface DrawingParticipationRecordData {
  childId: number;
  mode: string;
}

export interface DrawingParticipationRecordInfo {
  sketchParticipationId: number,
  childId: number,
  earlyExit: boolean,
  startTime: string,
  endTime: string,
  mode: string,
}
