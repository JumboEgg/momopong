export const getAudioPath = (index: number) => {
    const path = `/audios/${index}.mp3`;
    console.log('Generated audio path:', path);
    return path;
  };