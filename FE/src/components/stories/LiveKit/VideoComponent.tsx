import { LocalVideoTrack, RemoteVideoTrack } from 'livekit-client';
// import './VideoComponent.css';
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
  <div id={`camera-${participantIdentity}`} className="video-container">
    <div className="participant-data">
      <p>{participantIdentity + (local ? ' (You)' : '')}</p>
    </div>
    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
    <video ref={videoElement} id={track.sid} />
  </div>
);
}

export default VideoComponent;
