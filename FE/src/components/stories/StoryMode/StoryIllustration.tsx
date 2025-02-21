import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getBackgroundPath } from '@/utils/format/imgPath';
import { useStory } from '@/stores/storyStore';
import { useRecordList } from '@/stores/book/bookRecordListStore';
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
  hasObject,
  position,
}: StoryIllustrationProps) {
  // currentContent가 없으면 일찍 반환
  if (!currentContent) return null;

  const { mode } = useStory();
  const { drawingResult } = useRecordList();

  const relatedContents = [currentContent];

  const getSpeakerName = (type: CharacterType) => {
    if (type === 'narration') return '나레이션';
    if (type === 'role2') return `왕자님${userRole === 'role2' ? ' (나)' : ''}`;
    if (type === 'role1') return `신데렐라${userRole === 'role1' ? ' (나)' : ''}`;
    return '등장인물';
  };

  const ROLE_COLORS = {
    role1: 'text-pink-500', // 신데렐라 - 핑크
    role2: 'text-blue-600', // 왕자 - 파랑
    narration: 'text-white', // 내레이션
  } as const;

  return (
    <div className="relative w-[100vw] h-[100vh] mx-auto">
      <img
        src={illustration}
        alt={`Page ${pageNumber} illustration`}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* 다른 이미지를 얹을지 여부를 확인 */}
      {hasObject && position && (
      <img
        src={
          mode === 'reading'
          ? getBackgroundPath(position.sketchPath ?? '')
          : drawingResult ?? getBackgroundPath('pumbkinmagic.webp')
        } // position에 이미지 URL이 포함되어 있다고 가정
        alt="Overlay Object" // TODO : 정상 동작 테스트. 안 되면 합성한 이미지로 대체
        className="absolute"
        style={{
            top: `${position.y - position.ratio * 50}px`, // %로 위치 지정
            left: `${position.x - position.ratio * 80}px`,
            width: `${position.ratio * 160}px`, // %로 크기 지정
            transform: `rotate(${position.angle}deg)`, // 각도 회전
            transformOrigin: 'center', // 회전의 기준점
          }}
      />
      )}
      {/* 이전, 다음 버튼 */}
      <div className="px-4">
        {
          !isFirst && !userRole
          ? (
            <IconCircleButton
              size="sm"
              variant="action"
              className="fixed top-1/2 left-5 z-10"
              onClick={onPrevious}
              icon={<FontAwesomeIcon icon={faCaretLeft} size="sm" />}
            />
          ) : null
        }
        {
          !isLast && !userRole
          ? (
            <IconCircleButton
              size="sm"
              variant="action"
              className="fixed top-1/2 right-5 z-10"
              onClick={onNext}
              icon={<FontAwesomeIcon icon={faCaretRight} size="sm" />}
            />
          ) : null
        }
      </div>
      {/* 텍스트 오버레이📣 */}
      <div className="absolute top-8 left-8 font-[BMJUA]">
        <div className="text-white p-6 rounded-lg max-w-xl">
          {relatedContents.map((content) => {
            const isUserTurn = userRole === content.role;

            return (
              <div
                key={`${pageNumber}-${content.role}-${content.text.substring(0, 20)}`}
                className={`mb-4 last:mb-0 ${
                  isUserTurn && content.role !== 'narration'
                    ? `border-l-4 border-${content.role === 'role1' ? 'pink' : 'blue'}-500 pl-3`
                    : ''
                }`}
              >
                {content.role !== 'narration' && (
                <div className="text-xl font-medium text-white-700 mb-1 drop-shadow-sm">
                  {getSpeakerName(content.role)}
                </div>
                )}
                <p
                  className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide leading-relaxed ${ROLE_COLORS[content.role]}`}
                  style={{ textShadow: '2px 2px 2px black' }}
                >
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
