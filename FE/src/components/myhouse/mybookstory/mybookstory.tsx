import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';

interface BookData {
  id: number;
  title: string;
  date: string;
  color: string;
}

function getRandomColor(): string {
  const colors = [
    'bg-blue-400',
    'bg-red-400',
    'bg-green-400',
    'bg-purple-400',
    'bg-yellow-400',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function MyBookStory(): React.ReactNode {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // child_id를 로컬 스토리지나 전역 상태에서 가져옵니다
  const childId = localStorage.getItem('childId'); // 또는 다른 방식으로 child_id를 가져옴

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/{child_id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            // 필요한 경우 Authorization 헤더 추가
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        const formattedBooks = data.map((book: any) => ({
          id: book.id,
          title: book.title,
          date: new Date(book.readDate).toLocaleDateString(),
          color: getRandomColor(),
        }));

        setBooks(formattedBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBooks();
  }, [childId]);

  const handleBack = (): void => {
    navigate('/house');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
        <div className="text-xl">불러오는 중...</div>
      </div>
    );
  }

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
            {books.map((book) => (
              <div
                key={book.id}
                className="relative group cursor-pointer"
              >
                <div
                  className={`
                   ${book.color}
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
                 `}
                >

                  <div className="text-white font-bold">{book.title}</div>

                  <div className="flex items-center justify-between text-white/80">
                    <Book size={20} />
                    <span className="text-sm">{book.date}</span>
                  </div>

                  <div className="absolute top-0 right-0 h-full w-4 bg-black/10" />
                </div>
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
