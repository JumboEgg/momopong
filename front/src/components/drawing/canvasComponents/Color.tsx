import { useDrawing } from '../contexts/DrawingContext';
import colors from '../data/colorList';

function Color({ color }: { color: string }): JSX.Element {
  const {
    isErasing, setIsErasing, penColor, setPenColor,
  } = useDrawing();

  if (color === 'erase') {
    return (
      <button
        type="button"
        id="erase"
        className="color h-full flex flex-2 items-start"
        onClick={() => { setIsErasing(true); }}
        aria-label="eraser button"
      >
        <div
          className="bg-pink-200 w-8 md:w-12 ms-auto me-auto self-start transition-all duration-200"
          style={{ height: isErasing ? '80%' : '60%' }}
        />
      </button>
    );
  }
  return (
    <button
      type="button"
      id={color}
      className="color h-full flex flex-col flex-1 items-start overflow-visible relative me-1"
      onClick={() => {
        setPenColor(color);
        setIsErasing(false);
      }}
      aria-label="color selection button"
    >
      <div
        className="w-6 md:w-8 self-start transition-all duration-200 bg-gray-300 relative z-10"
        style={{ height: penColor === color && !isErasing ? '60%' : '40%' }}
      />
      <div
        className="w-6 h-3 md:w-8 md:h-4 rounded-b-full z-0"
        style={{ background: color, bottom: '-30%' }}
      />
    </button>

  );
}

function Palette() {
  const palette: JSX.Element[] = [];
  colors.forEach((color) => {
    palette.push(<Color key={color} color={color} />);
  });
  return <span className="flex h-20 md:h-24 items-start self-start me-2">{palette}</span>;
}

export default Palette;
