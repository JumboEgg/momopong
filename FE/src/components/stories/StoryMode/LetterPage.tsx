import AudioRecorderSTT from '@/utils/audioS3/AudioRecorderSTT';

function LetterPage() {
  return (
    <div className="w-screen h-screen bg-pink-200 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/images/bookcover/cover_theredridinghood.webp"
          alt="내가 맡은 등장인물"
          className="max-w-[80vw] max-h-[80vh] object-contain"
        />
      </div>
      <div className="absolute bottom-10 left-0 w-full flex justify-center">
        <AudioRecorderSTT />
      </div>
    </div>
  );
}

export default LetterPage;
