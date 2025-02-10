import '@/components/common/scrollbar.css';
import { useState, useEffect } from 'react';
import { FrameInfo } from '@/types/frame';
import loadImagesFromS3 from '@/utils/drawingS3/drawingLoad';
import { LetterInfo } from '@/types/letter';
import loadLettersFromS3 from '@/utils/audioS3/letterLoad';
import LetterModal from '@/components/common/modals/LetterModal';
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

interface CraftsTabProps {
  childId: string;
  childName: string;
}

function CraftsTab({ childId, childName }: CraftsTabProps) {
  const [drawingList, setDrawingList] = useState<FrameInfo[]>([]);
  const [letterList, setLetterList] = useState<LetterInfo[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [selectedCraftsTab, setSelectedCraftsTab] = useState<string>('reading');
  const [history, setHistory] = useState<JSX.Element[]>([]);

  const [modal, setModal] = useState<JSX.Element | null>(null);

  const fetchData = async (id: string) => {
    if (!id) return;
    try {
      const drawingData: FrameInfo[] = await loadImagesFromS3(id);
      setDrawingList(drawingData);

      const letterData: LetterInfo[] = await loadLettersFromS3(id);
      setLetterList(letterData);
    } catch (error) {
      console.error('Error loading images: ', error);
    }
  };

  useEffect(() => {
    if (!childId) return;
    fetchData(childId);
  }, [childId]);

  const openModal = (idx: number) => {
    console.log(idx);

    if (selectedCraftsTab === 'reading') {
      setModal(null);
    } else if (selectedCraftsTab === 'drawing') {
      setModal(
        <DrawingModal
          data={drawingList[idx]}
          onClose={() => setIsModalOpen(false)}
        />,
      );
    } else {
      setModal(
        <LetterModal
          childName={childName}
          data={letterList[idx]}
          onClose={() => setIsModalOpen(false)}
        />,
      );
    }

    setIsModalOpen(true);
  };

  const readingHistory = books.map((book, idx) => (
    <button
      type="button"
      key={book.id}
      className="w-full p-1"
      onClick={() => openModal(idx)}
    >
      <div className={`${book.color} aspect-8/5`} />
      <div className="font-[BMJUA]">{book.title}</div>
    </button>
  ));

  const drawingHistory = drawingList.map((data, idx) => (
    <button
      type="button"
      key={data.frameUrl}
      className="w-full p-1"
      onClick={() => openModal(idx)}
    >
      <img
        src={data.frameUrl}
        alt={data.frameTitle}
        className="bg-white rounded-lg w-full"
      />
    </button>
  ));

  const letterHistory = letterList.map((letter, idx) => (
    <button
      type="button"
      key={letter.letterFileName}
      className="w-full aspect-square p-1 bg-pink-100 "
      onClick={() => openModal(idx)}
    >
      {letter.role}
    </button>
  ));

  useEffect(() => {
    if (selectedCraftsTab === 'reading') setHistory(readingHistory);
    else if (selectedCraftsTab === 'drawing') setHistory(drawingHistory);
    else setHistory(letterHistory);
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
      {isModalOpen ? modal : null}
    </div>
  );
}

export default CraftsTab;
