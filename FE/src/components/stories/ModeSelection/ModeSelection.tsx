import { useStory } from '@/stores/storyStore';

function ModeSelection(): JSX.Element {
  const {
    setMode,
  } = useStory();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">신데렐라 동화</h1>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => setMode('reading')}
            className="py-4 px-6 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            읽기 모드
          </button>
          <button
            type="button"
            onClick={() => setMode('together')}
            className="py-4 px-6 text-lg font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
          >
            함께 읽기 모드
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModeSelection;
