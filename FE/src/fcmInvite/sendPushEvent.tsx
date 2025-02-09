import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const config = {
 apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
 authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
 projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
 storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
 messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
 appId: import.meta.env.VITE_FIREBASE_APP_ID,
 measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(config);
const messaging = getMessaging(app);

interface Toast {
 type: 'error' | 'success' | 'invitation' | 'accept' | 'reject' | 'expire';
 message: string;
}

const sendPushEvent: React.FC = () => {
 const [userId, setUserId] = useState('');
 const [inviteeId, setInviteeId] = useState('');
 const [bookId, setBookId] = useState('');
 const [toast, setToast] = useState<Toast | null>(null);

 const showToast = (message: string, type: Toast['type']) => {
   setToast({ type, message });
   setTimeout(() => setToast(null), 3000);
 };

 const sendInvitation = async () => {
   if (!userId || !inviteeId || !bookId) {
     showToast('모든 필드를 입력해주세요.', 'error');
     return;
   }

   try {
     const token = await getToken(messaging, {
       vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
     });
     console.log('Token:', token);
     showToast(`${inviteeId}님에게 초대장을 보냈어요!`, 'invitation');
   } catch (error) {
     showToast('초대장 보내기에 실패했습니다.', 'error');
   }
 };

 return (
   <div className="p-4 bg-white rounded shadow">
     <div className="space-y-4">
       <input
         type="text"
         placeholder="내 ID (보내는 사람)"
         value={userId}
         onChange={(e) => setUserId(e.target.value)}
         className="w-full p-2 border rounded"
       />
       <input
         type="text"
         placeholder="초대할 사용자 ID"
         value={inviteeId}
         onChange={(e) => setInviteeId(e.target.value)}
         className="w-full p-2 border rounded"
       />
       <input
         type="text"
         placeholder="책 ID"
         value={bookId}
         onChange={(e) => setBookId(e.target.value)}
         className="w-full p-2 border rounded"
       />
       <button
         type="button"
         onClick={sendInvitation}
         className="w-full p-2 text-white rounded bg-blue-500 hover:bg-blue-600"
       >
         초대하기
       </button>
     </div>

     {toast && (
       <div className={`fixed top-4 right-4 p-4 rounded shadow-lg text-white min-w-[300px] 
        ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}
       >
         {toast.message}
       </div>
     )}
   </div>
 );
};

export default sendPushEvent;
