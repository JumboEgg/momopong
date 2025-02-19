// // pages/button-demo.tsx
// import React from 'react';
// import TextButton from '@/components/common/buttons/TextButton';
// import { IconCircleButton, TextCircleButton } from '@/components/common/buttons/CircleButton';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faPause, faVolumeHigh, faMicrophone, faCaretRight, faUserGroup,
// } from '@fortawesome/free-solid-svg-icons';

// function ButtonDemo(): JSX.Element {
//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-2xl font-bold mb-8">Button Component Demo</h1>
//       <div className="space-y-8">
//         {/* White Background Buttons */}
//         <section>
//           <h2 className="text-xl font-bold mb-4">White Background</h2>
//           <div className="space-y-4">
//             <div className="flex gap-4 items-center">
//               {/* hasFocus 옵션을 적지 않으면 포커스가 동작하지 않습니다 */}
//               <TextButton size="sm" variant="white" className="">
//                 텍스트
//               </TextButton>
//               <TextButton size="md" variant="white" className="" hasFocus>텍스트</TextButton>
//               <TextButton size="lg" variant="white" className="">텍스트</TextButton>
//               <TextButton size="xl" variant="white" className="">텍스트</TextButton>
//             </div>
//             <div className="flex gap-4 items-center">
//               <TextButton size="sm" variant="white" className="" disabled>텍스트</TextButton>
//               <TextButton size="md" variant="white" className="" disabled>텍스트</TextButton>
//               <TextButton size="lg" variant="white" className="" disabled>텍스트</TextButton>
//               <TextButton size="xl" variant="white" className="" disabled>텍스트</TextButton>
//             </div>
//           </div>
//         </section>

//         {/* Gray Background Buttons */}
//         <section>
//           <h2 className="text-xl font-bold mb-4">Gray Background</h2>
//           <div className="space-y-4">
//             <div className="flex gap-4 items-center">
//               <TextButton size="sm" variant="gray" className="">텍스트</TextButton>
//               <TextButton size="md" variant="gray" className="">텍스트</TextButton>
//               <TextButton size="lg" variant="gray" className="">텍스트</TextButton>
//               <TextButton size="xl" variant="gray" className="">텍스트</TextButton>
//             </div>
//             <div className="flex gap-4 items-center">
//               <TextButton size="sm" variant="gray" className="" disabled>텍스트</TextButton>
//               <TextButton size="md" variant="gray" className="" disabled>텍스트</TextButton>
//               <TextButton size="lg" variant="gray" className="" disabled>텍스트</TextButton>
//               <TextButton size="xl" variant="gray" className="" disabled>텍스트</TextButton>
//             </div>
//           </div>
//         </section>

//         {/* Blue Background Buttons */}
//         <section>
//           <h2 className="text-xl font-bold mb-4">Blue Background</h2>
//           <div className="space-y-4">
//             <div className="flex gap-4 items-center">
//               <TextButton size="sm" variant="blue" className="">텍스트</TextButton>
//               <TextButton size="md" variant="blue" className="">텍스트</TextButton>
//               <TextButton size="lg" variant="blue" className="">텍스트</TextButton>
//               <TextButton size="xl" variant="blue" className="">텍스트</TextButton>
//             </div>
//             <div className="flex gap-4 items-center">
//               <TextButton size="sm" variant="blue" className="" disabled>텍스트</TextButton>
//               <TextButton size="md" variant="blue" className="" disabled>텍스트</TextButton>
//               <TextButton size="lg" variant="blue" className="" disabled>텍스트</TextButton>
//               <TextButton size="xl" variant="blue" className="" disabled>텍스트</TextButton>
//             </div>
//           </div>
//         </section>

//         {/* rounded text Buttons */}
//         <section>
//           <h2 className="text-xl font-bold mb-4">Rounded</h2>
//           <div className="space-y-4">
//             <div className="flex gap-4 items-center">
//               <TextButton size="sm" variant="rounded" className="">텍스트</TextButton>
//               <TextButton size="md" variant="rounded" className="">텍스트</TextButton>
//               <TextButton size="lg" variant="rounded" className="">텍스트</TextButton>
//               <TextButton size="xl" variant="rounded" className="">텍스트</TextButton>
//             </div>
//             <div className="flex gap-4 items-center">
//               <TextButton size="sm" variant="rounded" className="" disabled>텍스트</TextButton>
//               <TextButton size="md" variant="rounded" className="" disabled>텍스트</TextButton>
//               <TextButton size="lg" variant="rounded" className="" disabled>텍스트</TextButton>
//               <TextButton size="xl" variant="rounded" className="" disabled>텍스트</TextButton>
//             </div>
//           </div>
//         </section>

//         {/* default Buttons */}
//         <section>
//           <h2 className="text-xl font-bold mb-4">Default Button</h2>
//           <div className="space-y-4">
//             <div className="flex gap-4 items-center">
//               <IconCircleButton
//                 size="base"
//                 variant="default"
//                 className=""
//                 icon={<FontAwesomeIcon icon={faUserGroup} size="lg" />}
//               />
//             </div>
//           </div>
//         </section>

//         {/* action Buttons */}
//         <section>
//           <h2 className="text-xl font-bold mb-4">Action Button</h2>
//           <div className="space-y-4">
//             <div className="flex gap-4 items-center">
//               <IconCircleButton
//                 size="sm"
//                 variant="action"
//                 className=""
//                 icon={<FontAwesomeIcon icon={faPause} size="lg" />}
//               />
//               <TextCircleButton
//                 icon={<FontAwesomeIcon icon={faVolumeHigh} />}
//                 text="읽어주기"
//                 size="sm"
//                 variant="action"
//                 className="text-2xl"
//               />
//             </div>
//             <div className="flex gap-4 items-center">
//               <IconCircleButton size="sm" variant="action" disabled
//                icon={<FontAwesomeIcon icon={faPause} size="lg" />} />
//             </div>
//           </div>
//         </section>

//         {/* story Buttons */}
//         <section>
//           <h2 className="text-xl font-bold mb-4">Story Button</h2>
//           <div className="space-y-4">
//             <div className="flex gap-4 items-center">
//               {/* 이 버튼은 focus가 동작하지 않습니다 */}
//               <IconCircleButton size="md" variant="story"
//                  icon={<FontAwesomeIcon icon={faCaretRight} size="lg" />} hasFocus={false} />
//               {/* 이 버튼은 focus가 동작합니다 */}
//               <IconCircleButton
//                 size="lg"
//                 variant="story"
//                 className=""
//                 hasFocus
//                 icon={<FontAwesomeIcon icon={faMicrophone} />}
//               />
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default ButtonDemo;
