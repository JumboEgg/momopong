import { LocalAudioTrack, RemoteAudioTrack } from 'livekit-client';
import { useEffect, useRef } from 'react';

interface AudioComponentProps {
    track: LocalAudioTrack | RemoteAudioTrack;
}

function AudioComponent({ track }: AudioComponentProps) {
    const audioElement = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioElement.current) {
            track.attach(audioElement.current);
        }

        return () => {
            track.detach();
        };
    }, [track]);

    // eslint-disable-next-line jsx-a11y/media-has-caption
    return <audio ref={audioElement} id={track.sid} />;
}

export default AudioComponent;
