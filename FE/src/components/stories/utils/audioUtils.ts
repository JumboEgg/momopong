// src/utils/audioUtils.ts
export const getAudioUrl = (audioId: string): string => {
    const audioMapping: Record<string, string> = {
        // 1페이지
        scene1_narration1: '01.mp3',
        scene1_narration2: '02.mp3',
        scene1_narration3: '03.mp3',
        // 2페이지
        scene2_narration1: '04.mp3',
        // 3페이지
        scene3_narration1: '05.mp3',
        // 4페이지
        scene4_narration1: '06.mp3',
        scene4_narration2: '07.mp3',
        scene4_narration3: '08.mp3',
        scene4_narration4: '09.mp3',
        // 5페이지
        scene5_narration1: '10.mp3',
        scene5_narration2: '11.mp3',
        // 6페이지
        scene6_narration1: '12.mp3',
        // 7페이지
        scene7_narration1: '13.mp3',
        scene7_narration2: '14.mp3',
        scene7_narration3: '15.mp3',
        // 8페이지
        scene8_narration1: '16.mp3',
        // 9페이지
        scene9_narration1: '17.mp3',
        scene9_narration2: '18.mp3',
        // 10페이지
        scene10_narration1: '19.mp3',
        // 11페이지
        scene11_narration1: '20.mp3',
        scene11_narration2: '21.mp3',
        scene11_narration3: '22.mp3',
        scene11_narration4: '23.mp3',
        // 12페이지
        scene12_narration1: '24.mp3',
        scene12_narration2: '25.mp3',
        // 13페이지
        scene13_narration1: '26.mp3',
        scene13_narration2: '27.mp3',
        scene13_narration3: '28.mp3',
        scene13_narration4: '29.mp3',
        scene13_narration5: '30.mp3',
        // 14페이지
        scene14_narration1: '31.mp3',
        scene14_narration2: '32.mp3',
        scene14_narration3: '33.mp3',
        scene14_narration4: '34.mp3',
        // 15페이지
        scene15_narration1: '35.mp3',
        // 16페이지
        scene16_narration1: '36.mp3',
        scene16_narration2: '37.mp3',
        scene16_narration3: '38.mp3',
        // 17페이지
        scene17_narration1: '39.mp3',
        scene17_narration2: 'bell.mp3',
        // 18페이지
        scene18_narration1: '40.mp3',
        // 19페이지
        scene19_narration1: '41.mp3',
        // 20페이지
        scene20_narration1: '42.mp3',
        scene20_narration2: '43.mp3',
        // 21페이지
        scene21_narration1: '44.mp3',
        // 22페이지
        scene22_narration1: '45.mp3',
        scene22_narration2: '46.mp3',
        scene22_narration3: '48.mp3',
        scene22_narration4: '49.mp3',
        // 23페이지
        scene23_narration1: '50.mp3',
        scene23_narration2: '51.mp3',
        // 24페이지
        scene24_narration1: '52.mp3',
        // 25페이지
        scene25_narration1: '53.mp3',
        scene25_narration2: '54.mp3',
        scene25_narration3: '55.mp3',
        // 26페이지
        scene26_narration1: '56.mp3',
        scene26_narration2: '57.mp3',
        scene26_narration3: '58.mp3',
        // 27페이지
        scene27_narration1: '59.mp3',
        // 28페이지
        scene28_narration1: '60.mp3',
    };

    const fileName = audioMapping[audioId];
    if (!fileName) {
        console.warn(`No audio mapping found for: ${audioId}`);
        return '';
    }
    return `/temp-audio/${fileName}`;
    };

export default getAudioUrl;
