export const getAudioSrcPath = (path: string) => {
    const regex = /audio\/[^?]+\.mp3/;
    const match = path.match(regex);
    return match ? match[0] : '';
};
