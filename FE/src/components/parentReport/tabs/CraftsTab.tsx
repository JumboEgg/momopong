import { useDrawing } from '@/stores/drawingStore';
import '@/components/common/scrollbar.css';

interface CraftsTabProps {
  childName: string;
}

function CraftsTab({ childName }: CraftsTabProps) {
  const {
    localDrawingList,
  } = useDrawing();

  const drawingHistory = localDrawingList.map((data) => (
    <div className="w-full">
      {data}
    </div>
  ));

  return (
    <div className="w-full h-full">
      {' '}
      <div className="flex flex-col w-full h-full gap-y-5">
        <div className="text-xl md:text-2xl">
          {childName}
          (이)가 참여한 작품
        </div>
        <div className="w-full h-full grid grid-cols-3 justify-center items-start bg-yellow-100 border-4 border-yellow-300 rounded-2xl font-sans font-bold overflow-y-auto customScrollbar">
          {drawingHistory}
        </div>
      </div>
    </div>
  );
}

export default CraftsTab;
