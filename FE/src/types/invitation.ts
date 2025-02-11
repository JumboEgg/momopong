export type ContentType = 'BOOK' | 'SKETCH';

export interface FriendInvitation {
    bookId: number;
    inviterId: number;
    inviteeId: number;
    contentType: ContentType;
}
