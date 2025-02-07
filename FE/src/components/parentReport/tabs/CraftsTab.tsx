// CraftsTab.tsx
import { useDrawing, DrawingData } from '@/stores/drawingStore';
import '@/components/common/scrollbar.css';
import { useState } from 'react';
import DrawingModal from '../../common/modals/DrawingModal';

interface CraftsTabProps {
  childName: string;
}

function CraftsTab({ childName }: CraftsTabProps) {
  const { localDrawingList } = useDrawing();
  const [selectedData, setSelectedData] = useState<DrawingData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const showImg = (data: DrawingData) => {
    console.log(data.src);
    setSelectedData(data);
    setIsModalOpen(true); // Fixed: Changed from function call to setState
  };

  const drawingHistory = localDrawingList.map((data) => (
    <button
      type="button"
      key={data.src}
      className="w-full p-3"
      onClick={() => showImg(data)}
    >
      <img
        src={data.src}
        alt={data.title}
        className="bg-white rounded-lg w-full h-auto" // Added rounded corners and proper sizing
      />
    </button>
  ));

  return (
    <div className="w-full h-full">
      <div className="flex flex-col w-full h-full gap-y-5">
        <div className="text-xl md:text-2xl">
          {childName}
          (이)가 참여한 작품
        </div>
        <div className="w-full h-full grid grid-cols-3 justify-center items-start bg-yellow-100 border-4 border-yellow-300 rounded-2xl font-sans font-bold overflow-y-auto customScrollbar yellow p-4 gap-4">
          {drawingHistory}
        </div>
      </div>
      {isModalOpen && selectedData && ( // Added conditional rendering
        <DrawingModal
          data={selectedData}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default CraftsTab;
