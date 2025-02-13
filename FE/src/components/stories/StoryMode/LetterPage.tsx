import AudioRecorderSTT from '@/utils/audioS3/AudioRecorderSTT';

function LetterPage() {
    return (
      <div className="w-screen h-screen bg-pink-200">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <img
            src="./public/images/bookcover/cover_theredridinghood.webp"
            alt="내가 맡은 등장인물"
            className="w-[80%]"
          />
          <div
            className="-translate-y-25"
          >
            <AudioRecorderSTT />
          </div>
        </div>
      </div>
    );
}

export default LetterPage;
