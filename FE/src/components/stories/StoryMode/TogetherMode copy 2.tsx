import {
    LocalVideoTrack,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    Room,
    RoomEvent,
} from "livekit-client";
import "./App.css";
import { useState } from "react";
import VideoComponent from "./components/VideoComponent";
import AudioComponent from "./components/AudioComponent";

type TrackInfo = {
    trackPublication: RemoteTrackPublication;
    participantIdentity: string;
};

// OpenVidu 또는 LiveKit 서버 URL을 설정하기 위한 변수
let APPLICATION_SERVER_URL = "";
let LIVEKIT_URL = "";
configureUrls();

/**
 * 환경에 따라 APPLICATION_SERVER_URL과 LIVEKIT_URL을 설정하는 함수
 */
function configureUrls() {
    if (!APPLICATION_SERVER_URL) {
        if (window.location.hostname === "localhost") {
            APPLICATION_SERVER_URL = "https://i12d103.p.ssafy.io/api/"; // 로컬 환경일 경우 API 서버 URL 설정
        } else {
            APPLICATION_SERVER_URL = "https://i12d103.p.ssafy.io/api/"; // 배포 환경에서도 동일한 URL 사용
        }
    }

    if (!LIVEKIT_URL) {
        if (window.location.hostname === "localhost") {
            LIVEKIT_URL = "wss://i12d103.p.ssafy.io"; // 로컬 환경에서는 기본 WebSocket URL 사용
        } else {
            LIVEKIT_URL = "wss://i12d103.p.ssafy.io/openvidu"; // 배포 환경에서는 OpenVidu WebSocket URL 사용
        }
    }
}

function App() {
    const [room, setRoom] = useState<Room | undefined>(undefined); // 현재 참가 중인 방 상태
    const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(undefined); // 로컬 비디오 트랙 상태
    const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]); // 원격 참가자 트랙 목록

    const [participantName, setParticipantName] = useState("Participant" + Math.floor(Math.random() * 100)); // 참가자 이름
    const [roomName, setRoomName] = useState("Test Room"); // 참가할 방 이름
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [showImage, setShowImage] = useState(false);
    const [receivedImages, setReceivedImages] = useState<{participant: string, url: string}[]>([]);

    /**
     * LiveKit 방에 참가하는 함수
     */
    async function joinRoom() {
        const room = new Room(); // 새 LiveKit Room 객체 생성
        setRoom(room);

        // 새로운 트랙이 추가될 때 실행되는 이벤트 핸들러
        room.on(
            RoomEvent.TrackSubscribed,
            (_track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
                setRemoteTracks((prev) => [
                    ...prev,
                    { trackPublication: publication, participantIdentity: participant.identity }
                ]);
            }
        );

        room.on(RoomEvent.DataReceived, (payload, participant) => {
            const message = JSON.parse(new TextDecoder().decode(payload));
    
            if (message.type === "log") {
                console.log(`[LiveKit 메시지 수신] ${participant?.identity}: ${message.content}`);
    
                // 메시지에 이미지 URL이 포함되어 있으면 표시
                if (message.content.includes("Image:")) {
                    const imageUrl = message.content.split("Image: ")[1].trim();
                    setImageSrc(imageUrl);
                    setShowImage(true);
                }
            }
        });

        // 트랙이 제거될 때 실행되는 이벤트 핸들러
        room.on(RoomEvent.TrackUnsubscribed, (_track: RemoteTrack, publication: RemoteTrackPublication) => {
            setRemoteTracks((prev) => prev.filter((track) => track.trackPublication.trackSid !== publication.trackSid));
        });

        try {
            // 서버에서 토큰을 가져와서 사용
            const token = await getToken(roomName, participantName);
            
            // LiveKit 서버에 연결
            await room.connect(LIVEKIT_URL, token);

            // 로컬 참가자의 카메라 및 마이크 활성화
            await room.localParticipant.enableCameraAndMicrophone();

            // 활성화된 비디오 트랙 저장
            setLocalTrack(room.localParticipant.videoTrackPublications.values().next().value.videoTrack);
        } catch (error) {
            console.log("방 참가 중 오류 발생:", (error as Error).message);
            await leaveRoom();
        }
    }

    // page 변환 
    const sendLogMessage = () => {
        if (!room) return;
    
        const localParticipant = room.localParticipant;
        if (!localParticipant) return;
    
        const imageUrl = "/assets/images/openvidu_logo.png"; // public 경로에 있는 이미지 파일
        setImageSrc(imageUrl);
        setShowImage(true);
    
        const message = JSON.stringify({
            type: "log",
            content: `Hello from ${localParticipant.identity}! Image: ${imageUrl}`,
        });
    
        localParticipant.publishData(new TextEncoder().encode(message), {
            reliable: true,
        });
    
        console.log(`[내 콘솔] 메시지 전송 완료:`, message);
        setReceivedImages(prev => [...prev, { participant: localParticipant.identity, url: imageUrl }]);
    };

    

    /**
     * LiveKit 방을 떠나는 함수
     */
    async function leaveRoom() {
        await room?.disconnect(); // 방 나가기
        setRoom(undefined);
        setLocalTrack(undefined);
        setRemoteTracks([]);
    }

    /**
     * LiveKit 서버에서 방에 참가할 수 있는 토큰을 가져오는 함수
     */
    async function getToken(roomName: string, participantName: string) {
        const response = await fetch(APPLICATION_SERVER_URL + "token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                roomName: roomName,
                participantName: participantName
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`토큰을 가져오는 데 실패함: ${error.errorMessage}`);
        }

        const data = await response.json();
        return data.token;
    }

    return (
        <>
            {!room ? (
                // 방에 참가하지 않은 상태일 때 참가 폼을 보여줌
                <div id="join">
                    <div id="join-dialog">
                        <h2>비디오 방 참가</h2>
                        <form
                            onSubmit={(e) => {
                                joinRoom();
                                e.preventDefault();
                            }}
                        >
                            <div>
                                <label htmlFor="participant-name">참가자 이름</label>
                                <input
                                    id="participant-name"
                                    className="form-control"
                                    type="text"
                                    value={participantName}
                                    onChange={(e) => setParticipantName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="room-name">방 이름</label>
                                <input
                                    id="room-name"
                                    className="form-control"
                                    type="text"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                className="btn btn-lg btn-success"
                                type="submit"
                                disabled={!roomName || !participantName}
                            >
                                참가하기!
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                // 방에 참가한 경우 비디오와 오디오를 표시
                <div id="room">
                    <div id="room-header">
                        <h2 id="room-title">{roomName}</h2>
                        <button className="btn btn-danger" id="leave-room-button" onClick={leaveRoom}>
                            방 나가기
                        </button>
                        <button className="btn btn-danger" id="leave-room-button" onClick={sendLogMessage}>
                            메시지 보내기
                        </button>
                    </div>
                    <div id="layout-container">
                        {localTrack && (
                            <VideoComponent track={localTrack} participantIdentity={participantName} local={true} />
                        )}
                        {remoteTracks.map((remoteTrack) =>
                            remoteTrack.trackPublication.kind === "video" ? (
                                <VideoComponent
                                    key={remoteTrack.trackPublication.trackSid}
                                    track={remoteTrack.trackPublication.videoTrack!}
                                    participantIdentity={remoteTrack.participantIdentity}
                                />
                            ) : (
                                <AudioComponent
                                    key={remoteTrack.trackPublication.trackSid}
                                    track={remoteTrack.trackPublication.audioTrack!}
                                />
                            )
                        )}
                    </div>
                    {showImage && imageSrc && <img src={imageSrc} alt="샘플 이미지" width="300" />}
                </div>
                
            )}
        </>
    );
}

export default App;