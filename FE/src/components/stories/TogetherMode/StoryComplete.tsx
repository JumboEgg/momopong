function StoryComplete() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        스토리 완료!
      </h3>
      <button
        type="button"
        onClick={() => {
          window.location.href = '/home';
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default StoryComplete;
