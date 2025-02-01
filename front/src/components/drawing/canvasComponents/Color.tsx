import { useDrawing } from '../contexts/DrawingContext';
import colors from '../data/colorList';

function Color({ color }: { color: string }): JSX.Element {
  const {
    isErasing, setIsErasing, penColor, setPenColor,
  } = useDrawing();

  const eraserClass = `bg-pink-200 w-16 ms-auto me-auto transition-all duration-200 ${isErasing ? 'h-full' : 'h-[80%]'}`;
  const penClass = `h-full w-12 ms-auto me-auto transition-all duration-200 ${penColor === color ? 'h-full' : 'h-[80%]'}`;

  if (color === 'erase') {
    return (
      <button
        type="button"
        id="erase"
        className="color h-full flex-2"
        onClick={() => { setIsErasing(true); }}
        aria-label="eraser button"
      >
        <div className={eraserClass} />
      </button>
    );
  }
  return (
    <button
      type="button"
      id={color}
      className="color h-full flex-1"
      onClick={() => {
        setPenColor(color);
        setIsErasing(false);
      }}
      aria-label="color selection button"
    >
      <div
        className={penClass}
        style={{ background: color }}
      />
    </button>
  );
}

function Palette() {
  const palette: JSX.Element[] = [];
  colors.forEach((color) => {
    palette.push(<Color key={color} color={color} />);
  });
  return <span className="flex w-1xs md:w-1xl h-16 md:h-20">{palette}</span>;
}

export default Palette;
