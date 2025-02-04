import React, { useState, KeyboardEvent } from 'react';
import { ChevronRight, Volume2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Letter {
  id: number;
  sender: string;
  date: string;
  content: string;
}

// 예시 데이터
const initialLetters: Letter[] = [
  {
    id: 1,
    sender: '김민수',
    date: '2024-02-01',
    content: '사탕이에게 내가 오늘 평생 갈 사랑을 찾았다!!!! 네 덕분이다!!!!! 고맙다!!!! <신데렐라>의 <왕자>(이)가 보냄 2025.01.22',
  },
  {
    id: 2,
    sender: '이지영',
    date: '2024-01-25',
    content: '저희 결혼식에 와주셔서 정말 감사합니다. 그날 함께해주셔서 너무 행복했어요.',
  },
  {
    id: 3,
    sender: '박철호',
    date: '2024-01-15',
    content: '최근에 새로운 프로젝트를 시작했어요. 언제 한번 이야기 나누고 싶습니다.',
  },
  {
    id: 4,
    sender: '최영희',
    date: '2024-01-10',
    content: '오랜만에 만나서 커피 한잔 하고 싶어요. 요즘 너무 바빠서 연락을 못 드렸네요.',
  },
  {
    id: 5,
    sender: '정대현',
    date: '2024-01-05',
    content: '새해 복 많이 받으세요. 항상 건강하시고 좋은 일만 가득하길 바랍니다.',
  },
];

function MyLetters(): React.JSX.Element {
  const [letters] = useState<Letter[]>(initialLetters);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  function handleLetterSelect(letter: Letter): void {
    setSelectedLetter(letter);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>, letter: Letter): void {
    if (event.key === 'Enter' || event.key === ' ') {
      handleLetterSelect(letter);
    }
  }
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/house');
  };

  return (
    <div className="flex flex-col h-screen bg-yellow-100 p-4">
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
      <div className="flex flex-grow overflow-hidden">
        {selectedLetter ? (
          <div className="w-full flex items-center justify-center">
            <div className="flex rounded-2xl w-1/2 max-w-3xl h-[calc(100vh-200px)] overflow-hidden">
              {/* 선택된 편지 내용 */}
              <div className="w-1/2 bg-pink-200 p-6 mr-4 rounded-2xl border-4 border-none relative">
                {/* 읽어주기 버튼 수정 */}
                <button
                  type="button"
                  className="absolute top-4 right-4 bg-yellow-400 rounded-full p-4 hover:bg-yellow-300 transition-colors z-10 flex flex-col items-center"
                  style={{
                    width: '100px',
                    height: '100px',
                  }}
                >
                  <Volume2 size={50} className="text-black mb-1" />
                  <span className="text-sm font-bold text-black">읽어주기</span>
                </button>

                <div className="border-b pb-4 mb-4">
                  <div className="text-xl font-bold">{selectedLetter.sender}</div>
                  <div className="text-gray-500 text-xl">{selectedLetter.date}</div>
                  <button
                    type="button"
                    onClick={() => setSelectedLetter(null)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    목록으로 돌아가기
                  </button>
                </div>
                <div className="overflow-y-auto h-[calc(100%-100px)] text-xl">
                  <p>{selectedLetter.content}</p>
                </div>
              </div>

              {/* 받은 편지 목록 */}
              <div className="w-1/2 bg-yellow-200 rounded-2xl border-4 border-orange-300">
                <div className="p-4 font-bold text-xl">받은 편지</div>
                <div className="overflow-y-auto h-[calc(100%-4rem)]">
                  {letters.map((letter) => (
                    <div
                      key={letter.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleLetterSelect(letter)}
                      onKeyDown={(e) => handleKeyDown(e, letter)}
                      className={`p-4 bg-[#FBB787] hover:bg-gray-100 cursor-pointer flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 m-3 rounded-2xl ${selectedLetter.id === letter.id ? 'bg-gray-200' : ''}`}
                    >
                      <div>
                        <div className="font-bold text-lg">{letter.sender}</div>
                        <div className="text-lg text-gray-500">{letter.date}</div>
                      </div>
                      <ChevronRight className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 초기 상태 (편지 선택 전)
          <div className="w-full flex items-center justify-center">
            <div className="flex flex-col bg-yellow-200 border-4 border-orange-300 rounded-2xl shadow-lg w-1/2 max-w-3xl h-[calc(100vh-150px)] overflow-hidden">
              <div className="p-4 font-bold text-xl">받은 편지함</div>
              <div className="flex-grow overflow-y-auto">
                {letters.map((letter) => (
                  <div
                    key={letter.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleLetterSelect(letter)}
                    onKeyDown={(e) => handleKeyDown(e, letter)}
                    className="p-4 bg-[#FBB787] hover:bg-gray-100 cursor-pointer flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 m-3 rounded-2xl"
                  >
                    <div>
                      <div className="font-bold text-lg">{letter.sender}</div>
                      <div className="text-lg text-gray-500">{letter.date}</div>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLetters;
