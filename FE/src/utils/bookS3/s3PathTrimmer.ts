export const getAudioSrcPath = (path: string) => {
    const regex = /audio\/[^?]+\.mp3/;
    const match = path.match(regex);
    return match ? match[0] : '';
};

export const getImageSrcPath = (path: string) => {
    const regex = /image\/[^?]+\.webp/;
    const match = path.match(regex);
    return match ? match[0] : '';
};
