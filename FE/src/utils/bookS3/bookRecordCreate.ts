import { useRoleStore } from '@/stores/roleStore';
import useSubAccountStore from '@/stores/subAccountStore';

const makeBookRecord = async (selectedBookId: number, readingMode: string) => {
    try {
        const { accessToken } = useSubAccountStore.getState().childToken;

        // TODO : roleStore에 저장된 데이터로 교체
        const inviterId = useSubAccountStore.getState().selectedAccount?.childId;
        const inviteeId = 1;

        const inviterData = {
            childId: inviterId,
            bookId: selectedBookId,
            role: useRoleStore.getState().inviterRole,
            mode: readingMode,
        };
        const inviteeData = {
            childId: inviteeId,
            bookId: selectedBookId,
            role: useRoleStore.getState().inviteeRole,
            mode: readingMode,
        };

        const inviterResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/book/record/save`,
            {
                method: 'POST',
                body: JSON.stringify(inviterData),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!inviterResponse.ok) {
            throw new Error(`Inviter book record table creation failed: ${inviterResponse.status}`);
        }

        const inviteeResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/book/record/save`,
            {
                method: 'POST',
                body: JSON.stringify(inviteeData),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'applicaton/json',
                },
            },
        );

        if (!inviteeResponse.ok) {
            throw new Error(`Inviter book record table creation failed: ${inviterResponse.status}`);
        }

        const inviterReply = await inviterResponse.json();
        const inviteeReply = await inviteeResponse.json();

        console.log('inviter');
        console.log(inviterResponse.body);
        console.log('invitee');
        console.log(inviteeResponse.body);

        // TODO : 테이블 생성 결과 roleStore에 저장
        const bookRecordIdInfo = {
            inviterRecord: inviterReply,
            inviteeRecord: inviteeReply,
        };

        return bookRecordIdInfo;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default makeBookRecord;
