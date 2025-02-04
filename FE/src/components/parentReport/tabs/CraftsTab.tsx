import { useDrawing } from '@/stores/drawingStore';

interface CraftsTabProps {
  childName: string;
}

function CraftsTab({ childName }: CraftsTabProps) {
  const {
    localDrawingList,
  } = useDrawing();

  const drawingHistory = localDrawingList.map((data) => (
    <div>
      {data}
    </div>
  ));

  return (
    <div>
      {' '}
      <div className="flex flex-col w-full h-full gap-y-5">
        <div>
          {childName}
          (이)가 참여한 작품
        </div>
        <div className="w-full h-full grid justify-center items-start bg-blue-100 border-4 border-blue-300 rounded-2xl font-sans font-bold">
          {drawingHistory}
        </div>
      </div>
    </div>
  );
}

export default CraftsTab;
