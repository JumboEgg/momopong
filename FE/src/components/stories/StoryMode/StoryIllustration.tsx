// import { StoryIllustrationProps, CharacterType } from '../types/story';
// import { useRoomStore } from '@/stores/roomStore';
// /**
//  * StoryIllustration 컴포넌트
//  * - 동화책 페이지를 렌더링하는 역할
//  * - 현재 페이지의 삽화(illustration) 및 텍스트를 표시
//  * - 이전/다음 버튼을 통해 페이지 전환 가능
//  */
// function StoryIllustration({
//   pageNumber, // 현재 페이지 번호
//   onPrevious, // 이전 페이지 이동 함수
//   onNext, // 다음 페이지 이동 함수
//   isFirst, // 첫 번째 페이지 여부
//   isLast, // 마지막 페이지 여부
//   userRole, // 사용자 역할 ('role1' | 'role2' | undefined)
//   currentContent, // 현재 페이지의 텍스트 및 캐릭터 정보
//   illustration, // 현재 페이지 삽화 이미지 경로
// }: StoryIllustrationProps) {
//   // currentContent가 없으면 렌더링하지 않음
//   if (!currentContent) return null;
//   const { currentPage, sendPageUpdate } = useRoomStore(); // 현재 페이지 및 전송 함수 추가
  
//   // 현재 페이지의 텍스트를 배열로 저장 (향후 확장 가능)
//   const relatedContents = [currentContent];

//   /**
//    * 역할에 따른 캐릭터 이름 반환
//    * @param type - 캐릭터 유형 ('narration' | 'role1' | 'role2')
//    * @returns {string} 캐릭터 이름
//    */
//   const getSpeakerName = (type: CharacterType) => {
//     if (type === 'narration') return '나레이션';
//     if (type === 'role2') return `왕자님${userRole === 'role2' ? ' (나)' : ''}`;
//     if (type === 'role1') return `신데렐라${userRole === 'role1' ? ' (나)' : ''}`;
//     return '등장인물';
//   };

//   return (
//     <div style={{ height: '900px' }} className="relative w-full mx-auto mb-4">
//       {/* 현재 페이지의 삽화 이미지 */}
//       <img
//         src={illustration}
//         alt={`Page ${pageNumber} illustration`}
//         className="absolute inset-0 w-full h-full object-cover rounded-lg"
//       />

//       {/* 이전, 다음 페이지 이동 버튼 */}
//       <div className="absolute inset-0 flex items-center justify-between px-4">
//         <button
//           type="button"
//           onClick={onPrevious}
//           disabled={isFirst} // 첫 번째 페이지에서는 비활성화
//           className="px-6 py-3 bg-black bg-opacity-30 text-white rounded-full 
//                      hover:bg-opacity-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//         >
//           이전
//         </button>
//         <button
//           type="button"
//           onClick={onNext}
//           disabled={isLast} // 마지막 페이지에서는 비활성화
//           className="px-6 py-3 bg-black bg-opacity-30 text-white rounded-full 
//                      hover:bg-opacity-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//         >
//           다음
//         </button>
//       </div>

//       {/* 텍스트 오버레이 (페이지의 대사 또는 설명) */}
//       <div className="absolute bottom-8 left-8">
//         <div className="bg-black bg-opacity-30 text-white p-6 rounded-lg max-w-xl">
//           {relatedContents.map((content) => {
//             const isUserTurn = userRole === content.role; // 현재 사용자의 역할과 일치하는지 확인

//             return (
//               <div
//                 key={`${pageNumber}-${content.role}-${content.text.substring(0, 20)}`}
//                 className={`mb-4 last:mb-0 ${isUserTurn ? 'border-yellow-100' : ''}`} // 사용자의 차례면 강조 효과
//               >
//                 {/* 화자가 나레이션이 아닐 경우 화자 이름 표시 */}
//                 {content.role !== 'narration' && (
//                   <div className="text-sm font-medium text-gray-300 mb-1">
//                     {getSpeakerName(content.role)}
//                   </div>
//                 )}

//                 {/* 텍스트 내용 */}
//                 <p
//                   className={`text-xl font-bold tracking-wide leading-relaxed 
//                              ${isUserTurn ? 'text-yellow-200' : 'text-white'}`} // 사용자의 차례일 경우 강조 표시
//                 >
//                   {content.text}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default StoryIllustration;
import { StoryIllustrationProps, CharacterType } from '../types/story';
import { useRoomStore } from '@/stores/roomStore';

/**
 * StoryIllustration 컴포넌트
 * - 동화책 페이지를 렌더링하는 역할
 * - LiveKit을 활용하여 모든 참가자의 페이지를 동기화
 */
// function StoryIllustration({
//   onPrevious,
//   onNext,
//   userRole,
//   currentContent,
//   illustration,
//   totalPages,
// }: StoryIllustrationProps) {
//   // LiveKit을 통해 현재 페이지 관리
//   const { currentPage, sendPageUpdate } = useRoomStore();

//   // 첫 번째 및 마지막 페이지 여부를 LiveKit 상태로 확인
//   const isFirst = currentPage === 0;
//   const isLast = currentPage === totalPages - 1;

//   // currentContent가 없으면 렌더링하지 않음
//   if (!currentContent) return null;

//   /**
//    * 역할에 따른 캐릭터 이름 반환
//    */
//   const getSpeakerName = (type: CharacterType) => {
//     if (type === 'narration') return '나레이션';
//     if (type === 'role2') return `왕자님${userRole === 'role2' ? ' (나)' : ''}`;
//     if (type === 'role1') return `신데렐라${userRole === 'role1' ? ' (나)' : ''}`;
//     return '등장인물';
//   };

//   return (
//     <div style={{ height: '900px' }} className="relative w-full mx-auto mb-4">
//       {/* 현재 페이지의 삽화 이미지 */}
//       <img
//         src={illustration}
//         alt={`Page ${currentPage} illustration`}
//         className="absolute inset-0 w-full h-full object-cover rounded-lg"
//       />

//       {/* 이전, 다음 페이지 이동 버튼 */}
//       <div className="absolute inset-0 flex items-center justify-between px-4">
//         <button
//           type="button"
//           onClick={() => {
//             if (!isFirst) {
//               sendPageUpdate(currentPage - 1); // ✅ LiveKit에 변경 사항 전송
//               onPrevious();
//             }
//           }}
//           disabled={isFirst}
//           className="px-6 py-3 bg-black bg-opacity-30 text-white rounded-full 
//                      hover:bg-opacity-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//         >
//           이전
//         </button>
//         <button
//           type="button"
//           onClick={() => {
//             if (!isLast) {
//               sendPageUpdate(currentPage + 1); // ✅ LiveKit에 변경 사항 전송
//               onNext();
//             }
//           }}
//           disabled={isLast}
//           className="px-6 py-3 bg-black bg-opacity-30 text-white rounded-full 
//                      hover:bg-opacity-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//         >
//           다음
//         </button>
//       </div>

//       {/* 텍스트 오버레이 */}
//       <div className="absolute bottom-8 left-8">
//         <div className="bg-black bg-opacity-30 text-white p-6 rounded-lg max-w-xl">
//           <div className="text-sm font-medium text-gray-300 mb-1">
//             {getSpeakerName(currentContent.role)}
//           </div>
//           <p className="text-xl font-bold tracking-wide leading-relaxed text-white">
//             {currentContent.text}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect } from 'react';
function StoryIllustration({
  currentContentIndex,
  onPrevious,
  onNext,
  userRole,
  currentContent,
  illustration,
  totalPages,
}: StoryIllustrationProps) {
  const { currentPage } = useRoomStore(); // ✅ LiveKit에서 받은 페이지 사용 
  console.log(currentPage);

  // 첫 번째 및 마지막 페이지 여부 확인
  const isFirst = currentPage === 0;
  const isLast = currentPage === totalPages - 1;

  useEffect(() => {
    console.log(`페이지 변경됨: ${currentPage}`); // ✅ 변경 사항 디버깅
  }, [currentPage]);

  if (!currentContent) return null;

  return (
    <div style={{ height: '900px' }} className="relative w-full mx-auto mb-4">
      <img
        src={illustration}
        alt={`Page ${currentPage} illustration`} // ✅ LiveKit의 페이지 반영
        className="absolute inset-0 w-full h-full object-cover rounded-lg"
      />

      <div className="absolute inset-0 flex items-center justify-between px-4">
        <button
          type="button"
          onClick={() => {
            if (!isFirst) {
              useRoomStore.getState().sendPageUpdate(currentPage - 1);
              onPrevious(); // ✅ 상태와 UI 동기화
            }
          }}
          disabled={isFirst}
          className="px-6 py-3 bg-black bg-opacity-30 text-white rounded-full 
                     hover:bg-opacity-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          이전
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isLast) {
              useRoomStore.getState().sendPageUpdate(currentPage + 1);
              onNext(); // ✅ 상태와 UI 동기화
            }
          }}
          disabled={isLast}
          className="px-6 py-3 bg-black bg-opacity-30 text-white rounded-full 
                     hover:bg-opacity-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default StoryIllustration;
