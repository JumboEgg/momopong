import useSubAccountStore from '@/stores/subAccountStore';

const fetchSavedAudio = async () => {
    try {
        const { accessToken } = useSubAccountStore.getState().childToken;

        if (!accessToken) {
          throw new Error('Failed to get accessToken');
        }
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/profile/8/letter`,
        {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch letters');
      }

      const letters = await response.json();

      if (letters && letters.length > 0) {
        const latestLetter = letters[0];
        console.log('Trying to play audio from URL:', latestLetter.letterUrl);

        if (latestLetter.letterUrl) {
          const audioResponse = await fetch(latestLetter.letterUrl, {
            headers: {
              Accept: 'audio/wav,audio/*;q=0.9,*/*;q=0.8',
            },
          });

          if (!audioResponse.ok) {
            throw new Error('Failed to fetch audio file');
          }

          console.log('Content-Type:', audioResponse.headers.get('content-type'));

          const arrayBuffer = await audioResponse.arrayBuffer();
          const audioBlob = new Blob([arrayBuffer], {
            type: audioResponse.headers.get('content-type') || 'audio/wav',
          });

          const url = URL.createObjectURL(audioBlob);

          return url;
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching saved audio:', error);
      return null;
    }
};

export default fetchSavedAudio;
