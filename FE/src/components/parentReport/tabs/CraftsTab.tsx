import '@/components/common/scrollbar.css';
import { useState } from 'react';
import ReportLetterModal from '@/components/common/modals/ReportLetterModal';
import { useReportStore } from '@/stores/reportStore';
import DrawingModal from '../../common/modals/DrawingModal';

interface CraftsTabProps {
  childName: string;
}

function CraftsTab({ childName }: CraftsTabProps) {
  const {
    books, letters, sketches,
  } = useReportStore();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [selectedCraftsTab, setSelectedCraftsTab] = useState<string>('reading');

  const [modal, setModal] = useState<JSX.Element | null>(null);

  const openModal = (idx: number) => {
    if (selectedCraftsTab === 'reading') {
      setModal(null);
    } else if (selectedCraftsTab === 'drawing') {
      setModal(
        <DrawingModal
          data={sketches[idx]}
          onClose={() => setIsModalOpen(false)}
        />,
      );
    } else {
      setModal(
        <ReportLetterModal
          childName={childName}
          data={letters[idx]}
          onClose={() => setIsModalOpen(false)}
        />,
      );
    }

    setIsModalOpen(true);
  };

  const readingHistory = books.map((book, idx) => (
    <button
      type="button"
      key={book.bookId}
      className="w-full p-1"
      onClick={() => openModal(idx)}
    >
      <img src={book.bookPath} alt={book.title} className="w-full" />
      <div className="font-[BMJUA]">{book.title}</div>
    </button>
  ));

  const drawingHistory = sketches.map((data, idx) => (
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

  const letterHistory = letters.map((letter, idx) => (
    <button
      type="button"
      key={letter.letterFileName}
      className="w-full aspect-square p-1 bg-pink-100 "
      onClick={() => openModal(idx)}
    >
      {letter.role}
    </button>
  ));

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
            {selectedCraftsTab === 'reading' && readingHistory}
            {selectedCraftsTab === 'drawing' && drawingHistory}
            {selectedCraftsTab === 'letter' && letterHistory}
          </div>
        </div>
      </div>
      {isModalOpen ? modal : null}
    </div>
  );
}

export default CraftsTab;
