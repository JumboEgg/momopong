import React from 'react';

interface StorySelectionProps {
  onStorySelect: (storyId: string) => void;
}

export const StorySelection: React.FC<StorySelectionProps> = ({ onStorySelect }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">동화 선택하기</h1>
        
        <div className="space-y-4">
          <button
            onClick={() => onStorySelect('cinderella')}
            className="w-full bg-white border-2 border-purple-500 hover:border-purple-600 rounded-lg transition-colors overflow-hidden"
          >
            <div className="aspect-video w-full">
              <img 
                src="/images/cinderella.jpg" 
                alt="신데렐라" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">신데렐라</span>
                <span className="text-sm bg-purple-100 text-purple-600 px-2 py-1 rounded">5-7세</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                착한 소녀 신데렐라의 마법 같은 이야기
              </p>
            </div>
          </button>
          
          
          <button
            onClick={() => onStorySelect('cinderella')}
            className="w-full bg-white border-2 border-purple-500 hover:border-purple-600 rounded-lg transition-colors overflow-hidden"
          >
            <div className="aspect-video w-full">
              <img 
                src="/images/heungbu.jpg" 
                alt="흥부놀부" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">흥부놀부</span>
                <span className="text-sm bg-purple-100 text-purple-600 px-2 py-1 rounded">5-7세</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                욕심쟁이 놀부와 착한 흥부 이야기
              </p>
            </div>
          </button> 
        </div>
      </div>
    </div>
  );
};