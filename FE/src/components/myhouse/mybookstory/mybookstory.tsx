import { ArrowLeft, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const books = [
  {
    id: 1,
    title: '신데렐라',
    date: '2024-02-01',
    color: 'bg-blue-400',
  },
  {
    id: 2,
    title: '백설공주',
    date: '2024-01-28',
    color: 'bg-red-400',
  },
  {
    id: 3,
    title: '인어공주',
    date: '2024-01-25',
    color: 'bg-green-400',
  },
  {
    id: 4,
    title: '라푼젤',
    date: '2024-01-20',
    color: 'bg-purple-400',
  },
  {
    id: 5,
    title: '잠자는 숲속의 공주',
    date: '2024-01-15',
    color: 'bg-yellow-400',
  },
];

function MyBookStory() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/house');
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-8">
      {/* 뒤로가기 버튼 */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 hover:bg-gray-100"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* 타이틀 */}
      <h1 className="text-3xl font-bold text-center mb-8">내가 읽은 동화</h1>

      {/* 책장 */}
      <div className="max-w-5xl mx-auto">
        {/* 나무 책장 배경 */}
        <div className="bg-amber-800/20 rounded-lg p-8 shadow-xl">
          {/* 책 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="relative group cursor-pointer"
              >
                {/* 책 표지 */}
                <div className={`
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
                  {/* 책 제목 */}
                  <div className="text-white font-bold">{book.title}</div>

                  {/* 책 아이콘과 날짜 */}
                  <div className="flex items-center justify-between text-white/80">
                    <Book size={20} />
                    <span className="text-sm">{book.date}</span>
                  </div>

                  {/* 책등 효과 */}
                  <div className="absolute top-0 right-0 h-full w-4 bg-black/10" />
                </div>

                {/* 책 그림자 */}
                <div className="
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

          {/* 책장 선반 효과 */}
          <div className="h-4 bg-amber-900/20 mt-4 rounded" />
        </div>
      </div>
    </div>
  );
}

export default MyBookStory;
