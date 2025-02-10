export type StatusType = 'OFFLINE' | 'ONLINE' | 'MATCHING' | 'READING' | 'DRAWING';

export interface Friend {
  id: number;
  childId: number;
  name: string;
  profile: string;
  status: StatusType;
}

export interface FriendRequest {
  friendId: number;
  fromProfile: string;
  fromName: string;
  formId: number;
  toId: number;
}
