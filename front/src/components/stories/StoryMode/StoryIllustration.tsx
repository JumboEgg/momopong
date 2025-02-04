import storyData from '../data/cinderella';

interface StoryIllustrationProps {
  pageNumber: number;
  currentContentIndex: number;
}

function StoryIllustration({ pageNumber, currentContentIndex }: StoryIllustrationProps) {
  const page = storyData.find((p) => p.pageNumber === pageNumber);

  if (!page?.contents) return null;

  const currentContent = page.contents[currentContentIndex];
  const illustration = currentContent?.illustration;

  if (!illustration) return null;

  // 문장 분리 (줄바꿈 기준)
  const sentences = currentContent.text.split('\n');

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-4 h-96">
      <img
        src={illustration}
        alt={`Page ${pageNumber} illustration`}
        className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-30"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-60 text-white text-center p-6 rounded-lg max-w-xl">
          <p className="text-xl font-bold tracking-wide leading-relaxed">
            {sentences[currentContentIndex] || sentences[0]}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StoryIllustration;
