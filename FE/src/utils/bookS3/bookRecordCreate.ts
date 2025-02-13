import { useRoleStore } from '@/stores/roleStore';
import { useStory } from '@/stores/storyStore';
import useSubAccountStore from '@/stores/subAccountStore';

const makeBookRecord = async () => {
    try {
        const { accessToken } = useSubAccountStore.getState().childToken;
        const { bookId, mode } = useStory();

        // TODO : roleStore에 저장된 데이터로 교체
        const inviterId = useSubAccountStore.getState().selectedAccount?.childId;
        const inviteeId = 1;

        const inviterData = {
            childId: inviterId,
            bookId,
            role: useRoleStore.getState().inviterRole,
            mode,
        };
        const inviteeData = {
            childId: inviteeId,
            bookId,
            role: useRoleStore.getState().inviteeRole,
            mode,
        };

        const inviterResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/book/record/save`,
            {
                method: 'POST',
                body: JSON.stringify(inviterData),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'applicaton/json',
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
            inviterRecordId: inviterReply,
            inviteeRecordId: inviteeReply,
        };

        return bookRecordIdInfo;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default makeBookRecord;
