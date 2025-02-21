export type ContentType = 'BOOK' | 'SKETCH';

export interface FriendInvitation {
    contentId: number;
    inviterId: number;
    inviteeId: number;
    contentType: ContentType;
    inviterName?: string;
    inviteeName?: string;
    contentTitle?: string
}
