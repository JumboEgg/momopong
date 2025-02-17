import { StoryIllustrationProps, CharacterType } from '../types/story';

function StoryIllustration({
  pageNumber,
  // currentContentIndex,
  onPrevious,
  onNext,
  isFirst,
  isLast,
  userRole,
  currentContent, // props로 받기
  illustration, // props로 받기
}: StoryIllustrationProps) {
  // currentContent가 없으면 일찍 반환
  if (!currentContent) return null;

  const relatedContents = [currentContent];

  const getSpeakerName = (type: CharacterType) => {
    if (type === 'narration') return '나레이션';
    if (type === 'role2') return `왕자님${userRole === 'role2' ? ' (나)' : ''}`;
    if (type === 'role1') return `신데렐라${userRole === 'role1' ? ' (나)' : ''}`;
    return '등장인물';
  };

  const ROLE_COLORS = {
    role1: 'text-yellow-300', // 신데렐라
    role2: 'text-green-300', // 왕자
    narration: 'text-white', // 내레이션
  } as const;

  return (
    <div style={{ height: '900px' }} className="relative w-full mx-auto mb-4">
      <img
        src={illustration}
        alt={`Page ${pageNumber} illustration`}
        className="absolute inset-0 w-full h-full object-cover rounded-lg"
      />
      {/* 이전, 다음 버튼 */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirst}
          className="px-6 py-3 bg-black bg-opacity-30 text-white rounded-full hover:bg-opacity-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          이전
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isLast}
          className="px-6 py-3 bg-black bg-opacity-30 text-white rounded-full hover:bg-opacity-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          다음
        </button>
      </div>
      {/* 텍스트 오버레이 */}
      <div className="absolute bottom-8 left-8">
        <div className="bg-black bg-opacity-30 text-white p-6 rounded-lg max-w-xl">
          {relatedContents.map((content) => {
            const isUserTurn = userRole === content.role;

            return (
              <div
                key={`${pageNumber}-${content.role}-${content.text.substring(0, 20)}`}
                className={`mb-4 last:mb-0 ${
                  isUserTurn ? 'border-l-4 border-yellow-400 pl-3' : ''
                }`}
              >
                {content.role !== 'narration' && (
                <div className="text-sm font-medium text-gray-300 mb-1">
                  {getSpeakerName(content.role)}
                </div>
                )}
                <p className={`text-xl font-bold tracking-wide leading-relaxed ${ROLE_COLORS[content.role]}`}>
                  {content.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StoryIllustration;
