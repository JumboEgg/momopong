// import { useFriends } from '../contexts/FriendContext';

// interface FriendSelectionProps {
//   onFriendSelect: (friendId: string) => void;
//   onBack: () => void;
// }

// function FriendSelection({ onFriendSelect, onBack }: FriendSelectionProps): JSX.Element {
//   const { friends } = useFriends();

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//         <div className="flex items-center mb-6">
//           <button
//             type="button"
//             onClick={onBack}
//             className="text-gray-600 hover:text-gray-800"
//           >
//             ← 뒤로
//           </button>
//           <h2 className="text-2xl font-bold text-center flex-1">함께 읽을 친구 선택</h2>
//         </div>

//         <div className="space-y-4">
//           {friends.map((friend) => (
//             <button
//               key={friend.id}
//               type="button"
//               onClick={() => onFriendSelect(friend.id)}
//               className="w-full flex items-center
//  p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
//               disabled={friend.status === 'offline'}
//             >
//               <img
//                 src={friend.avatar}
//                 alt={`${friend.name}`}
//                 className="w-10 h-10 rounded-full"
//               />
//               <div className="ml-4 flex-1 text-left">
//                 {/* <p className="font-medium text-gray-900">{friend.name}</p> */}
//                 <p className={`text-sm ${
//                   friend.status === 'online' ? 'text-green-500' : 'text-gray-400'
//                 }`}
//                 >
//                   {friend.status === 'online' ? ' - 온라인' : ' - 오프라인'}
//                 </p>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FriendSelection;
