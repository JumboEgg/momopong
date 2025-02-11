import { LocalVideoTrack, RemoteVideoTrack } from 'livekit-client';
import './VideoComponent.css';
import { useEffect, useRef } from 'react';

interface VideoComponentProps {
    track: LocalVideoTrack | RemoteVideoTrack;
    participantIdentity: string;
    local?: boolean;
}

function VideoComponent({ track, participantIdentity, local = false }: VideoComponentProps) {
    const videoElement = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (videoElement.current) {
            track.attach(videoElement.current);
        }

        return () => {
            track.detach();
        };
    }, [track]);

    return (
      <div
        id={`camera-${participantIdentity}`}
        className="video-container"
      >
        <div className="participant-data">
          <p>{participantIdentity + (local ? ' (You)' : '')}</p>
        </div>
        <video
          ref={videoElement}
          id={track.sid}
          autoPlay
          playsInline
          muted={local}
          style={{ transform: local ? 'scaleX(-1)' : 'none' }} // 여기에 style 추가
          aria-label={`${participantIdentity}'s video stream`}
        >
          <track
            kind="captions"
            srcLang="en"
            label={`${participantIdentity}'s captions`}
          />
        </video>
      </div>
    );
  }

export default VideoComponent;
