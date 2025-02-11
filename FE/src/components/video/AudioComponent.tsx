// 필요한 타입과 훅을 livekit-client와 react에서 가져옴
import { LocalAudioTrack, RemoteAudioTrack } from 'livekit-client';
import { useEffect, useRef } from 'react';

// 컴포넌트의 props 타입 정의
// track은 LocalAudioTrack 또는 RemoteAudioTrack 타입이어야 함
interface AudioComponentProps {
   track: LocalAudioTrack | RemoteAudioTrack;
}

// AudioComponent는 오디오 트랙을 받아서 HTML audio 엘리먼트에 연결
function AudioComponent({ track }: AudioComponentProps) {
   // audio 엘리먼트를 참조하기 위한 ref 생성
   const audioElement = useRef<HTMLAudioElement | null>(null);

   // 컴포넌트가 마운트되거나 track이 변경될 때 실행
   useEffect(() => {
       // audio 엘리먼트가 존재하면
       if (audioElement.current) {
           // 오디오 트랙을 audio 엘리먼트에 연결
           track.attach(audioElement.current);
       }

       // 컴포넌트가 언마운트되거나 track이 변경되기 전에
       // 오디오 트랙 연결 해제
       return () => {
           track.detach();
       };
   }, [track]);

   // audio 엘리먼트 렌더링
   // track.sid를 id로 사용하여 트랙 식별
   return (
     <audio
       ref={audioElement}
       id={track.sid}
       autoPlay
       aria-label="Remote audio stream"
     >
       <track
         kind="captions"
         srcLang="en"
         label="Audio captions"
       />
     </audio>
   );
}

export default AudioComponent;
