import { useState, useEffect } from 'react';
import { Room, LocalVideoTrack, RemoteTrackPublication } from 'livekit-client';
import { tokenService } from '@/services/tokenService';

interface TrackInfo {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
}

interface LiveKitRoomResult {
  room: Room | undefined;
  localTrack: LocalVideoTrack | undefined;
  remoteTracks: TrackInfo[];
  serverUrl: string | undefined;
  token: string | undefined;
}

export function useLiveKitRoom(roomName: string, participantName: string): LiveKitRoomResult {
  const [serverUrl, setServerUrl] = useState<string>();
  const [token, setToken] = useState<string>();
  // 사용은 하지만 setter는 사용하지 않는 state들
  const [room] = useState<Room>();
  const [localTrack] = useState<LocalVideoTrack>();
  const [remoteTracks] = useState<TrackInfo[]>([]);

  let LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_SERVER_URL;
  const APPLICATION_SERVER_URL = import.meta.env.VITE_API_BASE_URL;

  // LiveKit URL이 설정되지 않은 경우 기본값 사용
  if (!LIVEKIT_URL) {
    if (window.location.hostname === 'localhost') {
      LIVEKIT_URL = 'wss://i12d103.p.ssafy.io';
    } else {
      LIVEKIT_URL = 'wss://i12d103.p.ssafy.io/openvidu';
    }
  }

//   useEffect(() => {
//     const getToken = async () => {
//       try {
//         // 액세스 토큰 유효성 확인
//         const accessToken = localStorage.getItem('accessToken');
//         if (!accessToken) {
//           console.error('No access token found');
//           // 로그인 페이지로 리다이렉트 또는 재인증 로직 추가
//           return;
//         }
//         const response = await fetch(`${APPLICATION_SERVER_URL}/token`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // 액세스 토큰 추가
//           },
//           body: JSON.stringify(
//             {
//               roomName,
//               participantName,
//             },
//           ),
//         });

//         if (!response.ok) {
//           throw new Error('Failed to get token');
//         }

//         const data = await response.json();
//         let url = LIVEKIT_URL;
//         if (!url.startsWith('wss://')) {
//           url = `wss://${url}`;
//         }

//         setServerUrl(url);
//         setToken(data.token);
//       } catch (error) {
//         console.error('Error getting token:', error);
//       }
//     };

//     getToken();
//   }, [roomName, participantName, APPLICATION_SERVER_URL, LIVEKIT_URL]);

//   return {
//     room,
//     localTrack,
//     remoteTracks,
//     serverUrl,
//     token,
//   };
// }

useEffect(() => {
  const getToken = async () => {
    // tokenService에서 활성 토큰 가져오기
    const accessToken = tokenService.getActiveToken();

    if (!accessToken) {
      console.error('No active token found');
      // 로그인 페이지로 리다이렉트 또는 다른 처리
      return;
    }

    try {
      const response = await fetch(`${APPLICATION_SERVER_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          roomName,
          participantName,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token request failed:', response.status, errorText);

        // 401 Unauthorized 처리
        if (response.status === 401) {
          // 토큰 갱신 또는 재로그인 로직
          return;
        }

        throw new Error('Failed to get token');
      }

      const data = await response.json();
      let url = LIVEKIT_URL;
      if (!url.startsWith('wss://')) {
        url = `wss://${url}`;
      }

      setServerUrl(url);
      setToken(data.token);
    } catch (error) {
      console.error('Error getting token:', error);
    }
  };

  getToken();
}, [roomName, participantName, APPLICATION_SERVER_URL, LIVEKIT_URL]);

return {
  room,
  localTrack,
  remoteTracks,
  serverUrl,
  token,
};
}
