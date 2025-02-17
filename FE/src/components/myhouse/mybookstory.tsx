import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { useReadingHistory } from '@/stores/book/readingHistoryStore';

function MyBookStory(): React.ReactNode {
  const navigate = useNavigate();
  const {
    readingList,
  } = useReadingHistory();

  const handleBack = () => {
    navigate('/house');
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
      <h1 className="text-3xl font-bold text-center mb-8">내가 읽은 동화</h1>

      <div className="max-w-5xl mx-auto">

        <div className="bg-amber-800/20 rounded-lg p-8 shadow-xl">

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {readingList.map((book) => (
              <div
                key={book.bookId}
                className="relative group"
              >
                <img
                  src={book.bookPath}
                  alt={book.title}
                  className="
                   h-48
                   rounded
                   shadow-lg
                   transform
                   transition-all
                   duration-300
                   group-hover:-translate-y-2
                   relative
                   flex
                   flex-col
                   justify-between
                   p-4
                   border-r-8
                   border-r-black/20
                 "
                />

                <div className="text-white font-bold">{book.title}</div>

                <div className="absolute top-0 right-0 h-full w-4 bg-black/10" />
                <div
                  className="
                   absolute
                   bottom-0
                   left-4
                   right-4
                   h-2
                   bg-black/20
                   rounded-full
                   blur-sm
                   transition-all
                   duration-300
                   group-hover:blur-md
                   group-hover:h-3
                 "
                />
              </div>
            ))}
          </div>

          <div className="h-4 bg-amber-900/20 mt-4 rounded" />
        </div>
      </div>
    </div>
  );
}

export default MyBookStory;
