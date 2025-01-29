export interface colorProps {
  color: string,
  setColor: React.Dispatch<React.SetStateAction<string>>,
  setIsErasing: React.Dispatch<React.SetStateAction<boolean>>
}

function Color({
  color,
  setColor,
  setIsErasing,
}: colorProps): JSX.Element {
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
        setColor(color);
        setIsErasing(false);
      }}
      style={{ flex: 1, background: color }}
      aria-label="color selection button"
    />
  );
}

export default Color;
