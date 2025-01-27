const getAudioPath = (index: number) => {
  const path = `/audios/${index}.mp3`;
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('Generated audio path:', path);
  }
  return path;
};

export default getAudioPath;
