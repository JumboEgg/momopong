const getAudioPath = (fileName: string): string => {
  console.log(`Generated audio path: /audio/${fileName}`); // 디버깅용
  return `/audio/${fileName}`;
};
export default getAudioPath;
