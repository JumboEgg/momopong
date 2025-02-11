interface StoryEndOverlayProps {
  onHomeClick?: () => void;
}

export function StoryEndOverlay({ onHomeClick }: StoryEndOverlayProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          함께했던 스토리는 나의집에서 다시볼수있어!
        </h3>
        <button
          type="button"
          onClick={onHomeClick}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg"
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
}
