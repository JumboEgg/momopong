export type StatusType = 'OFFLINE' | 'ONLINE' | 'MATCHING' | 'READING' | 'DRAWING';

export interface Friend {
  childId: number;
  name: string;
  profile: string;
  status: StatusType;
}

export interface FriendRequest {
  friendId: number;
  formId: number;
  toId: number;
}
