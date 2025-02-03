import storyData from '../data/cinderella';

interface StoryIllustrationProps {
  pageNumber: number;
}

function StoryIllustration({ pageNumber }: StoryIllustrationProps) {
  const page = storyData.find((p) => p.pageNumber === pageNumber);

  const illustration = page?.illustration || (page?.contents[0] as any)?.illustration;

  if (!illustration) return null;

  return (
    <div className="relative w-full max-w-md mx-auto mb-4">
      <img
        src={illustration}
        alt={`Page ${pageNumber} illustration`}
        className="w-full h-auto rounded-lg shadow-md"
      />
    </div>
  );
}

export default StoryIllustration;
