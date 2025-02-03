import React, { useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { faArrowLeft, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { TextCircleButton, IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '@/Components/common/scrollbar.css';

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
    sender: '<신데렐라>의 <왕자>',
    date: '2024-02-01',
    content: '내가 오늘 평생 갈 사랑을 찾았다!!!! 네 덕분이다!!!!! 고맙다!!!!',
  },
  {
    id: 2,
    sender: '<신데렐라>의 <신데렐라>',
    date: '2024-01-25',
    content: '저희 결혼식에 와주셔서 정말 감사합니다. 그날 함께해주셔서 너무 행복했어요.',
  },
  {
    id: 3,
    sender: '<프랑켄슈타인>의 <프랑켄슈타인 박사>',
    date: '2024-01-15',
    content: '최근에 새로운 프로젝트를 시작했어요. 언제 한번 이야기 나누고 싶습니다.',
  },
  {
    id: 4,
    sender: '<지킬 박사와 하이드>의 <지킬 박사>',
    date: '2024-01-10',
    content: '오랜만에 만나서 커피 한잔 하고 싶어요. 요즘 너무 바빠서 연락을 못 드렸네요.',
  },
  {
    id: 5,
    sender: '<해와 달이 된 오누이>의 <동생>',
    date: '2024-01-05',
    content: '새해 복 많이 받으세요. 항상 건강하시고 좋은 일만 가득하길 바랍니다.',
  },
  {
    id: 6,
    sender: '???',
    date: '2025-02-03',
    content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas facere voluptas magnam, dolor exercitationem amet neque iure dolore molestias possimus consequatur cupiditate optio impedit veniam consequuntur nesciunt voluptate ex. Iusto sunt accusamus vero at labore, distinctio repellendus ad numquam neque ea quasi, possimus deleniti sit ipsam magni? Obcaecati, ipsa. Quia at perspiciatis incidunt, possimus error ipsam omnis veniam iusto debitis repellendus a. Doloribus autem qui modi fugiat architecto. Vel laborum sunt quas eligendi? Alias accusamus, magnam quam facere odit a natus minus fuga ab, explicabo doloremque repellat ipsa quos molestias molestiae magni quasi officiis, suscipit enim quas beatae. Iure, reiciendis.',
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
        <IconCircleButton
          size="sm"
          variant="action"
          className=""
          onClick={handleBack}
          icon={<FontAwesomeIcon icon={faArrowLeft} size="lg" />}
        />
      </div>
      <div className="flex justify-end">
        <div className="w-full flex items-center justify-end relative">
          {/* selectedLetter div with animation */}
          <div className="absolute left-0 w-1/2 transition-all duration-500 ease-out transform">
            {selectedLetter && (
              <div
                className="bg-pink-200 p-6 mr-4 rounded-2xl relative font-[BMJUA] animate-slide-up"
                style={{
                  animation: 'slide-up 0.5s ease-out',
                }}
              >
                {/* 읽어주기 버튼 수정 */}
                <span className="absolute -top-10 right-3">
                  <TextCircleButton
                    icon={<FontAwesomeIcon icon={faVolumeHigh} />}
                    text="내가 보낸 편지"
                    size="sm"
                    variant="action"
                    className="text-2xl"
                  />
                </span>
                <p className="my-3 text-xl">사탕이에게</p>
                <div className="w-full h-[calc(100%-120px)] relative">
                  <div className="customScrollbar overflow-y-auto h-full text-xl">
                    <p>{selectedLetter.content}</p>
                  </div>
                </div>
                <p className="my-3 text-xl text-end">
                  {selectedLetter.sender}
                  {' '}
                  보냄
                </p>
              </div>
            )}
          </div>

          {/* 받은 편지 목록 */}
          <div className="w-1/2 bg-yellow-200 rounded-2xl border-4 p-4 border-orange-300 overflow-hidden min-w-2xl max-w-3xl h-[calc(100vh-200px)]">
            <div className="p-4 font-[BMJUA] text-2xl">내가 받은 편지들</div>
            <div className="customScrollbar overflow-y-auto h-[calc(100%-60px)]">
              {letters.map((letter) => (
                <div
                  key={letter.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (!selectedLetter || letter.id !== selectedLetter.id) {
                      handleLetterSelect(letter);
                    } else {
                      handleLetterSelect(null);
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, letter)}
                  className={`p-4 bg-[#FBB787] hover:bg-orange-200 cursor-pointer flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-orange-500 mx-3 mb-3 rounded-2xl ${selectedLetter && selectedLetter.id === letter.id ? 'bg-orange-300' : ''}`}
                >
                  <div>
                    <div className="font-[BMJUA] text-lg">{letter.sender}</div>
                    <div className="text-lg text-gray-500">{letter.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add keyframes for slide-up animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-up {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-slide-up {
    animation: slide-up 0.5s ease-out;
  }
`;
document.head.appendChild(style);

export default MyLetters;
