import { useDrawing } from '@/stores/drawing/drawingStore';

function WidthButton({ w, radius }: { w: number, radius: number }) {
    const {
        penColor, penWidth, setPenWidth,
    } = useDrawing();

    return (
      <button
        type="button"
        aria-label="set pen width 15"
        style={{
            width: `${Math.round(60 * radius)}px`,
            height: `${Math.round(60 * radius)}px`,
        }}
        className="rounded-full flex items-center justify-center"
        onClick={() => setPenWidth(w)}
      >
        <div
          style={{
                width: `${Math.round(w * radius)}px`,
                height: `${Math.round(w * radius)}px`,
                outline: penWidth === w ? `4px solid ${penColor === 'black' ? 'gray' : penColor}` : 'none',
            }}
          className="bg-black rounded-full"
        />
      </button>
    );
}

function PenWidth({ radius }: { radius: number }) {
    return (
      <div className="flex flex-col space-y-2 md:space-y-5 justify-between items-center">
        <WidthButton w={15} radius={radius} />
        <WidthButton w={30} radius={radius} />
        <WidthButton w={45} radius={radius} />
        <WidthButton w={60} radius={radius} />
      </div>
    );
}

export default PenWidth;
