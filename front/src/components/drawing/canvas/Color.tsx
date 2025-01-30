import { useDrawing } from '../contexts/DrawingContext';
import colors from '../data/colorList';

function Color({ color }: { color: string }): JSX.Element {
  const {
    setIsErasing, setPenColor,
  } = useDrawing();

  if (color === 'erase') {
    return (
      <button
        type="button"
        id="erase"
        className="color"
        onClick={() => { setIsErasing(true); }}
        style={{ flex: 1, background: 'pink' }}
        aria-label="eraser button"
      />
    );
  }
  return (
    <button
      type="button"
      id={color}
      className="color"
      onClick={() => {
        setPenColor(color);
        setIsErasing(false);
      }}
      style={{ flex: 1, background: color }}
      aria-label="color selection button"
    />
  );
}

function Palette() {
  const palette: JSX.Element[] = [];
  colors.forEach((color) => {
    palette.push(<Color key={color} color={color} />);
  });
  return <div style={{ display: 'flex', height: '3em' }}>{palette}</div>;
}

export default Palette;
