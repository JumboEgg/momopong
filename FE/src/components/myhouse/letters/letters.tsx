import React, { useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { faArrowLeft, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { TextCircleButton, IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '@/components/common/scrollbar.css';

interface Letter {
  id: number;
  sender: string;
  date: string;
  content: string;
}

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
  const navigate = useNavigate();

  function handleLetterSelect(letter: Letter | null): void {
    setSelectedLetter(letter);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>, letter: Letter): void {
    if (event.key === 'Enter' || event.key === ' ') {
      handleLetterSelect(letter);
    }
  }

  const handleBack = () => {
    navigate('/house');
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center">
      {/* Content wrapper with padding and full width */}
      <div className="w-full max-w-4xl px-4">
        {/* Back button container */}
        <IconCircleButton
          size="sm"
          variant="action"
          onClick={handleBack}
          icon={<FontAwesomeIcon icon={faArrowLeft} size="lg" />}
          className="fixed top-5 left-5"
        />

        {/* Main content container */}
        <div className="h-[80vh]">
          <div className="flex gap-4 h-full">
            {/* Left side - Selected Letter */}
            <div className="w-1/2 h-full">
              {selectedLetter ? (
                <div
                  className="bg-pink-200 p-6 rounded-2xl relative font-[BMJUA] h-full animate-slide-up"
                >
                  <span className="absolute -top-10 right-3">
                    <TextCircleButton
                      icon={<FontAwesomeIcon icon={faVolumeHigh} />}
                      text="내가 보낸 편지"
                      size="sm"
                      variant="action"
                      className="text-2xl"
                    />
                  </span>
                  <p className="my-3 text-xl ps-4">사탕이에게</p>
                  <div className="h-[calc(100%-160px)]">
                    <div className="customScrollbar overflow-y-auto h-full text-xl px-4">
                      <p>{selectedLetter.content}</p>
                    </div>
                  </div>
                  <p className="my-3 text-xl text-end px-4">
                    {selectedLetter.sender}
                    {' '}
                    보냄
                  </p>
                </div>
              ) : (
                <div className="h-full rounded-2xl font-[BMJUA] text-2xl flex justify-center items-center">
                  누구의 편지를 읽어볼까?
                </div>
              )}
            </div>

            {/* Right side - Letters List */}
            <div className="w-1/2 bg-yellow-200 rounded-2xl border-4 border-orange-300 overflow-hidden h-full p-4">
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
                    className={`p-4 bg-[#FBB787] hover:bg-orange-200 cursor-pointer flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-orange-500 mx-3 mb-3 rounded-2xl ${
                      selectedLetter && selectedLetter.id === letter.id ? 'bg-orange-300' : ''
                    }`}
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
    </div>
  );
}

export default MyLetters;
