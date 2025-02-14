const fetchSavedAudio = async (audioUrl: string) => {
  try {
    if (audioUrl) {
      const audioResponse = await fetch(audioUrl);

      if (!audioResponse.ok) {
        throw new Error('Failed to fetch audio file');
      }

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
