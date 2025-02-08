import { useDrawing } from '@/stores/drawingStore';
import '@/components/common/scrollbar.css';
import { useState, useEffect } from 'react';
import { FrameInfo } from '@/types/frame';
import loadImagesFromS3 from '@/utils/drawing/drawingLoad';
import DrawingModal from '../../common/modals/DrawingModal';

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

const letters = [
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

interface CraftsTabProps {
  childId: number;
  childName: string;
}

function CraftsTab({ childId, childName }: CraftsTabProps) {
  const {
    drawingList, setDrawingData,
  } = useDrawing();
  const [selectedData, setSelectedData] = useState<FrameInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCraftsTab, setSelectedCraftsTab] = useState<string>('reading');
  const [history, setHistory] = useState<JSX.Element[]>([]);

  const fetchData = async (id: number) => {
    if (!id) return;
    try {
      const data: FrameInfo[] = await loadImagesFromS3(id.toString());
      setDrawingData(data);
    } catch (error) {
      console.error('Error loading images: ', error);
    }
  };

  useEffect(() => {
    if (!childId) return;
    fetchData(childId);
  }, [childId]);

  const showImg = (data: FrameInfo) => {
    console.log(data.frameUrl);
    setSelectedData(data);
    setIsModalOpen(true);
  };

  const readingHistory = books.map((book) => (
    <button
      type="button"
      key={book.id}
      className="w-full p-1"
      onClick={() => console.log(book.title)}
    >
      <div className={`${book.color} aspect-8/5`} />
      <div className="font-[BMJUA]">{book.title}</div>
    </button>
  ));

  const drawingHistory = drawingList.map((data) => (
    <button
      type="button"
      key={data.frameUrl}
      className="w-full p-1"
      onClick={() => showImg(data)}
    >
      <img
        src={data.frameUrl}
        alt={data.frameTitle}
        className="bg-white rounded-lg w-full"
      />
    </button>
  ));

  const letterHistory = letters.map((letter) => (
    <button
      type="button"
      key={letter.id}
      className="w-full aspect-square p-1 bg-pink-100 "
      onClick={() => console.log(letter.sender)}
    >
      {letter.sender}
    </button>
  ));

  useEffect(() => {
    if (selectedCraftsTab === 'reading') setHistory(readingHistory);
    else if (selectedCraftsTab === 'drawing') setHistory(drawingHistory);
    else setHistory(letterHistory);

    console.log(selectedCraftsTab);
  }, [selectedCraftsTab]);

  return (
    <div className="w-full h-full">
      <div className="flex flex-col w-full h-full gap-y-5">
        <div className="text-lg md:text-xl">
          {childName}
          (이)가 참여한 작품
        </div>
        <div className="w-full h-full flex justify-center items-start bg-yellow-100 border-4 border-yellow-300 rounded-2xl font-sans overflow-y-auto yellow p-4 gap-4">
          <div className="flex flex-col h-full w-20 justify-evenly items-center
            font-[BMJUA] text-xl"
          >
            <button
              type="button"
              onClick={() => setSelectedCraftsTab('reading')}
              style={{ color: selectedCraftsTab === 'reading' ? 'orange' : 'var(--color-amber-300)' }}
            >
              동화
            </button>
            <button
              type="button"
              onClick={() => setSelectedCraftsTab('drawing')}
              style={{ color: selectedCraftsTab === 'drawing' ? 'orange' : 'var(--color-amber-300)' }}
            >
              그림
            </button>
            <button
              type="button"
              onClick={() => setSelectedCraftsTab('letter')}
              style={{ color: selectedCraftsTab === 'letter' ? 'orange' : 'var(--color-amber-300)' }}
            >
              편지
            </button>
          </div>
          <div className="w-full h-full grid grid-cols-2 md:grid-cols-3 justify-center items-start customScrollbar yellow pe-4 gap-2">
            {history}
          </div>
        </div>
      </div>
      {isModalOpen && selectedData && (
        <DrawingModal
          data={selectedData}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default CraftsTab;
