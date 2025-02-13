import useSubAccountStore from '@/stores/subAccountStore';

const fetchSavedAudio = async (audioUrl: string) => {
  try {
    const { accessToken } = useSubAccountStore.getState().childToken;

    if (!accessToken) {
      throw new Error('Failed to get accessToken');
    }

    console.log('Trying to play audio from URL:', audioUrl);

    if (audioUrl) {
      const audioResponse = await fetch(audioUrl);

      if (!audioResponse.ok) {
        throw new Error('Failed to fetch audio file');
      }

      console.log('Content-Type:', audioResponse.headers.get('content-type'));

      const arrayBuffer = await audioResponse.arrayBuffer();
      const audioBlob = new Blob([arrayBuffer], {
        type: audioResponse.headers.get('content-type') || 'audio/webm',
      });

      const url = URL.createObjectURL(audioBlob);

      return url;
    }
    return null;
  } catch (error) {
    console.error('Error fetching saved audio:', error);
    return null;
  }
};

export default fetchSavedAudio;
