import { useState } from 'react';
import useRecentLetterStore from '@/stores/letter/recentLetterStore';
import RecentLetterModal from './modals/RecentLetterModal';

function RecentLetterList() {
  const {
    isLoading, recentLetterList, selectedLetter, setSelectedLetter,
  } = useRecentLetterStore();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div className="max-w-md mx-auto rounded-lg overflow-hidden">
      {!recentLetterList || recentLetterList.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          알림이 없습니다
        </div>
      ) : (
        recentLetterList.map((letter) => (
          <button
            key={letter.letterFileName}
            type="button"
            className="flex w-full items-center m-1 p-3 bg-amber-200 rounded-2xl"
            onClick={() => {
              setIsModalOpen(true);
              setSelectedLetter(letter);
            }}
          >
            <div className="w-full font-[GeekbleMalang2WOFF2]">
              <div className="break-keep text-start text-xl">
                {letter.bookTitle}
                의
                {' '}
                {letter.role}
                (이)가 편지를 보냈어요
              </div>
              <div className="text-end text-md">{letter.createdAt.substring(0, 10)}</div>
            </div>
          </button>
        ))
      )}
      { isModalOpen && selectedLetter ? (
        <RecentLetterModal data={selectedLetter} />
       ) : null }
    </div>
  );
}

export default RecentLetterList;
