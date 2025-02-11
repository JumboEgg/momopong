export type NotificationType = 'error' | 'success' | 'invitation' | 'accept' | 'reject';

export interface Toast {
  type: NotificationType;
  message: string;
}

export interface InvitationData {
  inviterId: number;
  inviteeId: number;
  inviterName: string;
  inviteeName: string;
  contentId: number;
  contentTitle: string;
}
