import { useDrawing } from '../contexts/DrawingContext';

function ResultPage() {
  const {
    imageData,
  } = useDrawing();

  return (
    <div>
      <div>
        <img src={imageData} alt="내가 그린 구두 그림" />
      </div>
    </div>
  );
}

export default ResultPage;
