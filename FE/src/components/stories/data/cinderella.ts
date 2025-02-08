export type CharacterType = 'narration' | 'princess' | 'prince';

export interface StoryPageContent {
  type: CharacterType;
  text: string;
  audioId: string;
}

export interface StoryPage {
  pageNumber: number;
  illustration: string;
  contents: StoryPageContent[];
}

const storyData: StoryPage[] = [
  {
    pageNumber: 1,
    illustration: '/images/storyimg/1.png',
    contents: [
      {
        type: 'narration',
        text: '옛날 옛적, 착한 소녀 신데렐라가 살았습니다.',
        audioId: 'scene1_narration1',
      },
      {
        type: 'narration',
        text: '신데렐라는 어린 시절 부모님을 잃고 새어머니, 두 언니와 함께 살게 되었지요.',
        audioId: 'scene1_narration2',
      },
      {
        type: 'narration',
        text: '그들은 마음씨 착하고 예쁜 신데렐라를 미워하고 구박했습니다.',
        audioId: 'scene1_narration3',
      },
    ],
  },
  {
    pageNumber: 2,
    illustration: '/images/storyimg/2-1.png',
    contents: [
      {
        type: 'narration',
        text: '어느 날, 성에서 무도회가 열린다는 소식이 들려왔어요.',
        audioId: 'scene2_narration1',
      },
    ],
  },
  {
    pageNumber: 3,
    illustration: '/images/storyimg/2.png',
    contents: [
      {
        type: 'narration',
        text: '새언니들과 새엄마는 화려한 마차를 타고 성으로 향했고, 홀로 남은 신데렐라는 다락방으로 돌아와 훌쩍훌쩍 울고 말았답니다.',
        audioId: 'scene3_narration1',
      },
    ],
  },
  {
    pageNumber: 4,
    illustration: '/images/storyimg/3.png',
    contents: [
      {
        type: 'narration',
        text: '그때였어요! 반짝이는 별빛 같은 광채와 함께 요정 할머니가 나타났답니다.',
        audioId: 'scene4_narration1',
      },
      {
        type: 'narration',
        text: '"신데렐라야 왜 그렇게 울고 있니?"',
        audioId: 'scene4_narration2',
      },
      {
        type: 'princess',
        text: '"저도 무도회에 가고 싶었어요."',
        audioId: 'scene4_narration3',
      },
      {
        type: 'narration',
        text: '"지금 가장 하고 싶은 것이 무도회장에 가고 싶은 거지, 그렇지? 어디 볼까."',
        audioId: 'scene4_narration4',
      },
    ],
  },
  {
    pageNumber: 5,
    illustration: '/images/storyimg/4.png',
    contents: [
      {
        type: 'narration',
        text: '요정 할머니는 잠시 고민하더니 신데렐라에게 정원에서 호박을 가져와 달라고 했습니다.',
        audioId: 'scene5_narration1',
      },
      {
        type: 'narration',
        text: '신데렐라는 가장 크고 좋은 호박을 가져와 밖에서 기다리는 할머니에게 건네주었습니다.',
        audioId: 'scene5_narration2',
      },
    ],
  },
  {
    pageNumber: 6,
    illustration: '/images/storyimg/5.png',
    contents: [
      {
        type: 'narration',
        text: '요술 지팡이가 호박에 닿자 순식간에 황금으로 뒤덮인, 아름다운 마차로 변했습니다.',
        audioId: 'scene6_narration1',
      },
    ],
  },
  {
    pageNumber: 7,
    illustration: '/images/storyimg/6.png',
    contents: [
      {
        type: 'narration',
        text: '요정 할머니는 그런 다음 구석으로 가 덫에 걸려 있던 여섯 마리의 생쥐들을 한 마리씩 놓았고 그녀는 차례차례 지팡이로 생쥐를 두드렸습니다.',
        audioId: 'scene7_narration1',
      },
      {
        type: 'narration',
        text: '그러자 생쥐들은 늠름한 말과 마부로 바뀌었고, 정원의 도마뱀은 하인들로 바뀌었습니다.',
        audioId: 'scene7_narration2',
      },
      {
        type: 'narration',
        text: '"이제 무도회장으로 갈 수 있겠구나."',
        audioId: 'scene7_narration3',
      },
    ],
  },
  {
    pageNumber: 8,
    illustration: '/images/storyimg/7.png',
    contents: [
      {
        type: 'princess',
        text: '"하지만 저에게는 이 재투성이 옷뿐이에요."',
        audioId: 'scene8_narration1',
      },
    ],
  },
  {
    pageNumber: 9,
    illustration: '/images/storyimg/8.png',
    contents: [
      {
        type: 'narration',
        text: '요정 할머니는 인자하게 웃으며 요술 지팡이로 신데렐라를 아주 살짝 건드렸습니다.',
        audioId: 'scene9_narration1',
      },
      {
        type: 'narration',
        text: '그러자, 신데렐라의 옷이 예쁜 드레스로 변했답니다.',
        audioId: 'scene9_narration2',
      },
    ],
  },
  {
    pageNumber: 10,
    illustration: '/images/storyimg/8-1.png',
    contents: [
      {
        type: 'narration',
        text: '요정 할머니는 마지막으로 아름다운 구두를 신데렐라에게 건넸습니다.',
        audioId: 'scene10_narration1',
      },
    ],
  },
  {
    pageNumber: 11,
    illustration: '/images/storyimg/9.png',
    contents: [
      {
        type: 'narration',
        text: '구두까지 신은 신데렐라는 마차에 올라탔답니다.',
        audioId: 'scene11_narration1',
      },
      {
        type: 'narration',
        text: '그때 요정 할머니가 말했습니다.',
        audioId: 'scene11_narration2',
      },
      {
        type: 'narration',
        text: '"명심하거라, 밤 12시를 알리는 종이 열 두 번 울리기 전엔 돌아와야 한단다. 그 이후엔 마법이 풀릴 게야."',
        audioId: 'scene11_narration3',
      },
      {
        type: 'princess',
        text: '"명심할게요. 12시 전엔 집으로 돌아오겠어요."',
        audioId: 'scene11_narration4',
      },
    ],
  },
  {
    pageNumber: 12,
    illustration: '/images/storyimg/9-1.png',
    contents: [
      {
        type: 'narration',
        text: '그 말을 끝으로 마차가 출발했습니다.',
        audioId: 'scene12_narration1',
      },
      {
        type: 'narration',
        text: '신데렐라는 떨리는 마음을 주체할 수 없었습니다.',
        audioId: 'scene12_narration2',
      },
    ],
  },
  {
    pageNumber: 13,
    illustration: '/images/storyimg/10.png',
    contents: [
      {
        type: 'narration',
        text: '그 시각, 성 안에서는 왕자님이 왕과 왕비 곁에서 곤란해하고 있었어요.',
        audioId: 'scene13_narration1',
      },
      {
        type: 'narration',
        text: '부모님은 어서 왕자가 제 짝을 찾기를 바랐거든요.',
        audioId: 'scene13_narration2',
      },
      {
        type: 'narration',
        text: '그때 마침 새로운 손님이 도착했다는 소식이 들려왔어요.',
        audioId: 'scene13_narration3',
      },
      {
        type: 'narration',
        text: '왕자님은 신데렐라를 보자마자 마치 봄날의 꽃을 본 것처럼 설레었답니다.',
        audioId: 'scene13_narration4',
      },
      {
        type: 'prince',
        text: '"아름다운 공주님, 저와 한 곡 추시겠습니까?"',
        audioId: 'scene13_narration5',
      },
    ],
  },
  {
    pageNumber: 14,
    illustration: '/images/storyimg/11.png',
    contents: [
      {
        type: 'narration',
        text: '신데렐라는 고개를 끄덕이고는 그의 손을 잡고 무도회장 중앙으로 이동했습니다.',
        audioId: 'scene14_narration1',
      },
      {
        type: 'narration',
        text: '두 사람은 누가 보기에도 잘 어울리는 아름다운 한 쌍이었습니다.',
        audioId: 'scene14_narration2',
      },
      {
        type: 'narration',
        text: '같은 자리에 있던 새언니와 새엄마조차 그녀가 신데렐라라는 생각도 하지 못한 채 그저 넋 놓고 그들을 바라보기 바빴습니다.',
        audioId: 'scene14_narration3',
      },
      {
        type: 'narration',
        text: '곡이 끝나자 왕자는 다른 귀족들의 시선은 아랑곳하지 않는 듯 신데렐라의 손을 살며시 잡고 말했습니다.',
        audioId: 'scene14_narration4',
      },
    ],
  },
  {
    pageNumber: 15,
    illustration: '/images/storyimg/12.png',
    contents: [
      {
        type: 'prince',
        text: '"테라스로 나가 이야기를 나누지 않으시겠습니까? 여긴 너무 시끄럽네요."',
        audioId: 'scene15_narration1',
      },
    ],
  },
  {
    pageNumber: 16,
    illustration: '/images/storyimg/13.png',
    contents: [
      {
        type: 'narration',
        text: '달빛이 내리비치는 테라스에서 두 사람은 오랫동안 이야기를 나누었답니다.',
        audioId: 'scene16_narration1',
      },
      {
        type: 'prince',
        text: '"이상하게도 당신과 함께 있으면 마음이 편안해집니다."',
        audioId: 'scene16_narration2',
      },
      {
        type: 'prince',
        text: '"그러고 보니 아직 이름조차 모르는군요. 알려 주시겠습니까?"',
        audioId: 'scene16_narration3',
      },
    ],
  },
  {
    pageNumber: 17,
    illustration: '/images/storyimg/14-1.jpg',
    contents: [
      {
        type: 'narration',
        text: '그때 갑자기 종소리가 울렸어요.',
        audioId: 'scene17_narration1',
      },
      {
        type: 'narration',
        text: '뎅- 뎅-',
        audioId: 'scene17_narration2',
      },
    ],
  },
  {
    pageNumber: 18,
    illustration: '/images/storyimg/14.png',
    contents: [
      {
        type: 'narration',
        text: '신데렐라는 깜짝 놀라 도망치듯 달려갔고, 황금빛 마차는 어둠 속으로 사라졌답니다.',
        audioId: 'scene18_narration1',
      },
    ],
  },
  {
    pageNumber: 19,
    illustration: '/images/storyimg/15.png',
    contents: [
      {
        type: 'narration',
        text: '계단에서 떨어진 유리 구두 한 짝만이 달빛 아래 반짝였어요.',
        audioId: 'scene19_narration1',
      },
    ],
  },
  {
    pageNumber: 20,
    illustration: '/images/storyimg/16.png',
    contents: [
      {
        type: 'narration',
        text: '한 짝만 남은 구두를 주워든 왕자는 시종들에게 말했습니다.',
        audioId: 'scene20_narration1',
      },
      {
        type: 'prince',
        text: '"들어라. 이 구두가 발에 꼭 맞는 여인과 결혼할 것이니 날이 밝으면 내가 직접 거리로 나서겠다."',
        audioId: 'scene20_narration2',
      },
    ],
  },
  {
    pageNumber: 21,
    illustration: '/images/storyimg/17-1.png',
    contents: [
      {
        type: 'narration',
        text: '다음날, 왕자는 시종들을 이끌고 귀족들의 집을 하나씩 방문하게 되었습니다.',
        audioId: 'scene21_narration1',
      },
    ],
  },
  {
    pageNumber: 22,
    illustration: '/images/storyimg/17.png',
    contents: [
      {
        type: 'narration',
        text: '그들은 곧 신데렐라의 집에도 찾아왔어요.',
        audioId: 'scene22_narration1',
      },
      {
        type: 'narration',
        text: '두 언니도 구두를 신어봤지만 당연하게도 들어가지 않았습니다.',
        audioId: 'scene22_narration2',
      },
      {
        type: 'prince',
        text: '"다른 여인은 더 없소?"',
        audioId: 'scene22_narration3',
      },
      {
        type: 'narration',
        text: '"그럼요. 다른 아이는 없답니다."',
        audioId: 'scene22_narration4',
      },
    ],
  },
  {
    pageNumber: 23,
    illustration: '/images/storyimg/18-1.png',
    contents: [
      {
        type: 'narration',
        text: '새엄마는 거짓말을 했지만, 이야기를 가만히 듣던 신데렐라는 문을 열고 나가 자신이 더 있음을 알렸습니다.',
        audioId: 'scene23_narration1',
      },
      {
        type: 'princess',
        text: '"아직 제가 신어 보지 않았어요."',
        audioId: 'scene23_narration2',
      },
    ],
  },
  {
    pageNumber: 24,
    illustration: '/images/storyimg/18-2.png',
    contents: [
      {
        type: 'narration',
        text: '깜짝 놀란 새엄마가 신데렐라에게 어서 들어가라 성화였지만, 가만히 신데렐라를 바라보던 왕자는 고개를 끄덕였습니다.',
        audioId: 'scene24_narration1',
      },
    ],
  },
  {
    pageNumber: 25,
    illustration: '/images/storyimg/19.png',
    contents: [
      {
        type: 'prince',
        text: '"모든 여인이 신어 보는 것이 조건이었습니다. 이리 와서 구두를 신어 보시죠."',
        audioId: 'scene25_narration1',
      },
      {
        type: 'narration',
        text: '구두가 신데렐라의 발에 쏙 들어갔어요.',
        audioId: 'scene25_narration2',
      },
      {
        type: 'narration',
        text: '그때 요정 할머니가 나타나 마법으로 신데렐라를 다시 아름답게 만들어주었답니다.',
        audioId: 'scene25_narration3',
      },
    ],
  },
  {
    pageNumber: 26,
    illustration: '/images/storyimg/19-1.jpg',
    contents: [
      {
        type: 'narration',
        text: '왕자는 기뻐하며 신데렐라의 손을 잡았습니다.',
        audioId: 'scene26_narration1',
      },
      {
        type: 'prince',
        text: '"다시 만나고 싶었습니다. 이제 당신의 이름을 들을 수 있겠습니까?"',
        audioId: 'scene26_narration2',
      },
      {
        type: 'princess',
        text: '"저는 신데렐라예요."',
        audioId: 'scene26_narration3',
      },
    ],
  },
  {
    pageNumber: 27,
    illustration: '/images/storyimg/20.png',
    contents: [
      {
        type: 'narration',
        text: '이 모든 상황을 지켜보던 새엄마와 새언니들은 무릎을 꿇고 신데렐라에게 그동안 괴롭혔던 것에 대해 용서를 빌었습니다.',
        audioId: 'scene27_narration1',
      },
    ],
  },
  {
    pageNumber: 28,
    illustration: '/images/storyimg/21.png',
    contents: [
      {
        type: 'narration',
        text: '마음씨 고운 신데렐라는 그들을 용서했고, 왕자님과 함께 성으로 떠나 행복하게 살았답니다.',
        audioId: 'scene28_narration1',
      },
    ],
  },
];

export default storyData;
