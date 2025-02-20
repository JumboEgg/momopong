import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { useReadingHistory } from '@/stores/book/readingHistoryStore';
import { getCoverPath } from '@/utils/format/imgPath';
import { BookItemInfo } from '@/types/book';
import { useState } from 'react';
import { useReadingHistoryContent } from '@/stores/book/readingHistoryContentStore';
import DialogModal from '../common/modals/DialogModal';

function MyBookStory(): React.ReactNode {
  const navigate = useNavigate();
  const {
    readingList,
  } = useReadingHistory();

  const {
    readingHistoryContent, setReadingHistoryContent,
  } = useReadingHistoryContent();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleBack = () => {
    navigate('/house');
  };

  const openModal = (book: BookItemInfo) => {
    setIsModalOpen(true);
    setReadingHistoryContent(book.bookId);
  };

  const readMyBook = () => {
    navigate('/house/mybookstory/record');
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-8">
      <IconCircleButton
        size="sm"
        variant="action"
        onClick={handleBack}
        icon={<FontAwesomeIcon icon={faArrowLeft} size="lg" />}
        className="fixed top-5 left-5"
      />
      <h1 className="text-3xl text-center mb-8 font-[BMJUA]">내가 만든 동화</h1>

      <div className="max-w-5xl mx-auto">

        <div className="bg-amber-800/20 rounded-lg p-8 shadow-xl">
          {
            readingList.length === 0
            ? (
              <div className="w-full min-h-[30vh] font-[BMJUA] text-xl text-center">
                아직 친구와 함께 동화나라를 여행하지 않았어요
              </div>
              )
            : null
          }

          <div className="grid grid-cols-3 gap-6">
            {readingList.map((book) => (
              <button
                type="button"
                onClick={() => openModal(book)}
                key={book.bookId}
                className="relative group"
              >
                <img
                  src={getCoverPath(book.bookPath)}
                  alt={book.title}
                  className="w-full rounded shadow-lg
                   transform transition-all duration-300 group-hover:-translate-y-2
                   relative flex flex-col justify-between"
                />
                <div
                  className="absolute bottom-0 left-4 right-4 h-2
                   bg-black/20 rounded-full blur-sm
                   transition-all duration-300 group-hover:blur-md group-hover:h-3"
                />
              </button>
            ))}
          </div>

          <div className="h-4 bg-amber-900/20 mt-4 rounded" />
        </div>
      </div>
      {
        isModalOpen ? (
          <DialogModal
            type="confirm"
            message1={`내가 만든 ${readingHistoryContent?.bookTitle}(을)를`}
            message2="다시 볼까요?"
            onConfirm={() => readMyBook()}
            onClose={() => setIsModalOpen(false)}
          />
        ) : null
      }
    </div>
  );
}

export default MyBookStory;
