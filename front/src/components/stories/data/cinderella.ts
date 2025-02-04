export type CharacterType = 'narration' | 'princess' | 'prince';

export interface StoryPage {
  pageNumber: number;
  contents: {
    type: CharacterType;
    text: string;
    audioFiles: string[];
  }[];
}

export interface StoryPageContent {
  type: CharacterType;
  text: string;
  audioFiles: string[];
  illustration?: string; // 선택적 속성으로 추가
}

const storyData: StoryPage[] = [
  {
    pageNumber: 1,
    contents: [{
      type: 'narration',
      text: '옛날 옛적, 착한 소녀 신데렐라가 살았습니다.',
      audioFiles: ['01.mp3'],
      illustration: '/images/storyimg/1.png',
    },
    {
      type: 'narration',
      text: '신데렐라는 어린 시절 부모님을 잃고 새어머니, 두 언니와 함께 살게 되었지요.',
      audioFiles: ['02.mp3'],
      illustration: '/images/storyimg/1.png',
    },
    {
      type: 'narration',
      text: '그들은 마음씨 착하고 예쁜 신데렐라를 미워하고 구박했습니다.',
      audioFiles: ['03.mp3'],
      illustration: '/images/storyimg/1.png',
    } as StoryPageContent],
  },
  {
    pageNumber: 2,
    contents: [{
      type: 'narration',
      text: '어느 날, 성에서 가면 무도회가 열린다는 소식이 들려왔어요.',
      audioFiles: ['04.mp3'],
      illustration: '/images/storyimg/2.png',
    },
    {
      type: 'narration',
      text: '새언니들과 새엄마는 화려한 마차를 타고 성으로 향했고, 홀로 남은 신데렐라는 다락방으로 돌아와 훌쩍훌쩍 울고 말았답니다.',
      audioFiles: ['05.mp3'],
      illustration: '/images/storyimg/2.png',
    },
    ],
  },
  {
    pageNumber: 3,
    contents: [
      {
        type: 'narration',
        text: '그때였어요! 반짝이는 별빛 같은 광채와 함께 요정 할머니가 나타났답니다.',
        audioFiles: ['06.mp3'],
        illustration: '/images/storyimg/3.png',
      },
      {
        type: 'narration',
        text: '"신데렐라야 왜 그렇게 울고 있니?"',
        audioFiles: ['07.mp3'],
        illustration: '/images/storyimg/3.png',
      },
      {
        type: 'princess',
        text: '"저도 가면 무도회에 가고 싶었어요."',
        audioFiles: ['08.mp3'],
        illustration: '/images/storyimg/3.png',
      },
      {
        type: 'narration',
        text: '"지금 가장 하고 싶은 것이 무도회장에 가고 싶은 거지, 그렇지? 어디 볼까."',
        audioFiles: ['09.mp3'],
        illustration: '/images/storyimg/3.png',
      },
    ],
  },
  {
    pageNumber: 4,
    contents: [{
      type: 'narration',
      text: '요정 할머니는 잠시 고민하더니 신데렐라에게 정원에서 호박을 가져와 달라고 했습니다.',
      audioFiles: ['10.mp3'],
      illustration: '/images/storyimg/4.png',
    },
    {
      type: 'narration',
      text: '신데렐라는 가장 크고 좋은 호박을 가져와 밖에서 기다리는 할머니에게 건네주었습니다.',
      audioFiles: ['11.mp3'],
      illustration: '/images/storyimg/4.png',
    },
    {
      type: 'narration',
      text: '요술 지팡이가 호박에 닿자 순식간에 황금으로 뒤덮인, 아름다운 마차로 변했습니다.',
      audioFiles: ['12.mp3'],
      illustration: '/images/storyimg/5.png',
    },
    ],
  },
  {
    pageNumber: 5,
    contents: [
      {
        type: 'narration',
        text: '요정 할머니는 그런 다음 구석으로 가 덫에 걸려 있던 여섯 마리의 생쥐들을 한 마리씩 놓았고 그녀는 차례차례 지팡이로 생쥐를 두드렸습니다.',
        audioFiles: ['13.mp3'],
        illustration: '/images/storyimg/6.png',
      },
      {
        type: 'narration',
        text: '그러자 생쥐들은 늠름한 말과 마부로 바뀌었고, 정원의 도마뱀은 하인들로 바뀌었습니다.',
        audioFiles: ['14.mp3'],
        illustration: '/images/storyimg/6.png',
      },
      {
        type: 'narration',
        text: '"이제 무도회장으로 갈 수 있겠구나."',
        audioFiles: ['15.mp3'],
        illustration: '/images/storyimg/6.png',
      },
      {
        type: 'princess',
        text: '"하지만 저에게는 이 재투성이 옷뿐이에요."',
        audioFiles: ['16.mp3'],
        illustration: '/images/storyimg/7.png',
      },
    ],
  },
  {
    pageNumber: 6,
    contents: [{
      type: 'narration',
      text: '요정 할머니는 인자하게 웃으며 요술 지팡이로 신데렐라를 아주 살짝 건드렸습니다.',
      audioFiles: ['17.mp3'],
      illustration: '/images/storyimg/8.png',
    },
    {
      type: 'narration',
      text: '그러자, 신데렐라의 옷이 예쁜 드레스로 변했답니다.',
      audioFiles: ['18.mp3'],
      illustration: '/images/storyimg/8.png',
    },
    {
      type: 'narration',
      text: '요정 할머니는 마지막으로 아름다운 구두를 신데렐라에게 건넸습니다.',
      audioFiles: ['19.mp3'],
      illustration: '/images/storyimg/8.png',
    },
    ],
  },
  {
    pageNumber: 7,
    contents: [
      {
        type: 'narration',
        text: '구두까지 신은 신데렐라는 마차에 올라탔답니다.',
        audioFiles: ['20.mp3'],
        illustration: '/images/storyimg/9.png',
      },
      {
        type: 'narration',
        text: '그때 요정 할머니가 말했습니다.',
        audioFiles: ['21.mp3'],
        illustration: '/images/storyimg/9.png',
      },
      {
        type: 'narration',
        text: '"명심하거라, 밤 12시를 알리는 종이 열 두 번 울리기 전엔 돌아와야 한단다. 그 이후엔 마법이 풀릴 게야."',
        audioFiles: ['22.mp3'],
        illustration: '/images/storyimg/9.png',
      },
      {
        type: 'princess',
        text: '"명심할게요. 12시 전엔 집으로 돌아오겠어요."',
        audioFiles: ['23.mp3'],
        illustration: '/images/storyimg/9.png',
      },
      {
        type: 'narration',
        text: '그 말을 끝으로 마차가 출발했습니다.',
        audioFiles: ['24.mp3'],
        illustration: '/images/storyimg/9.png',
      },
      {
        type: 'narration',
        text: '신데렐라는 떨리는 마음을 주체할 수 없었습니다.',
        audioFiles: ['25.mp3'],
        illustration: '/images/storyimg/9.png',
      },
    ],
  },
  {
    pageNumber: 8,
    contents: [{
      type: 'narration',
      text: '그 시각, 성 안에서는 왕자님이 왕과 왕비 곁에서 곤란해하고 있었어요.',
      audioFiles: ['26.mp3'],
      illustration: '/images/storyimg/10.png',
    },
    {
      type: 'narration',
      text: '부모님은 어서 왕자가 제 짝을 찾기를 바랐거든요.',
      audioFiles: ['27.mp3'],
      illustration: '/images/storyimg/10.png',
    },
    {
      type: 'narration',
      text: '그때 마침 새로운 손님이 도착했다는 소식이 들려왔어요.',
      audioFiles: ['28.mp3'],
      illustration: '/images/storyimg/10.png',
    },
    {
      type: 'narration',
      text: '왕자님은 신데렐라를 보자마자 마치 봄날의 꽃을 본 것처럼 설레었답니다.',
      audioFiles: ['29.mp3'],
      illustration: '/images/storyimg/10.png',
    },
    ],
  },
  {
    pageNumber: 9,
    contents: [
      {
        type: 'prince',
        text: '"아름다운 공주님, 저와 한 곡 추시겠습니까?"',
        audioFiles: ['30.mp3'],
        illustration: '/images/storyimg/10.png',
      },
      {
        type: 'narration',
        text: '신데렐라는 고개를 끄덕이고는 그의 손을 잡고 무도회장 중앙으로 이동했습니다.',
        audioFiles: ['31.mp3'],
        illustration: '/images/storyimg/11.png',
      },
      {
        type: 'narration',
        text: '두 사람은 누가 보기에도 잘 어울리는 아름다운 한 쌍이었습니다.',
        audioFiles: ['32.mp3'],
        illustration: '/images/storyimg/11.png',
      },
      {
        type: 'narration',
        text: '같은 자리에 있던 새언니와 새엄마조차 그녀가 신데렐라라는 생각도 하지 못한 채 그저 넋 놓고 그들을 바라보기 바빴습니다.',
        audioFiles: ['33.mp3'],
        illustration: '/images/storyimg/11.png',
      },
      {
        type: 'narration',
        text: '곡이 끝나자 왕자는 다른 귀족들의 시선은 아랑곳하지 않는 듯 신데렐라의 손을 살며시 잡고 말했습니다.',
        audioFiles: ['34.mp3'],
        illustration: '/images/storyimg/11.png',
      },
      {
        type: 'prince',
        text: '"테라스로 나가 이야기를 나누지 않으시겠습니까? 여긴 너무 시끄럽네요."',
        audioFiles: ['35.mp3'],
        illustration: '/images/storyimg/12.png',
      },
    ],
  },
  {
    pageNumber: 10,
    contents: [
      {
        type: 'narration',
        text: '달빛이 내리비치는 테라스에서 두 사람은 오랫동안 이야기를 나누었답니다.',
        audioFiles: ['36.mp3'],
        illustration: '/images/storyimg/13.png',
      },
      {
        type: 'prince',
        text: '"이상하게도 당신과 함께 있으면 마음이 편안해집니다."',
        audioFiles: ['37.mp3'],
        illustration: '/images/storyimg/13.png',
      },
      {
        type: 'prince',
        text: '"그러고 보니 아직 이름조차 모르는군요. 알려 주시겠습니까?"',
        audioFiles: ['38.mp3'],
        illustration: '/images/storyimg/13.png',
      },
    ],
  },
  {
    pageNumber: 11,
    contents: [{
      type: 'narration',
      text: '그때 갑자기 종소리가 울렸어요.',
      audioFiles: ['39.mp3'],
      illustration: '/images/storyimg/14-1.jpg',
    },
    {
      type: 'narration',
      text: '뎅- 뎅-',
      audioFiles: ['bell.mp3'],
      illustration: '/images/storyimg/14-1.jpg',
    },
    ],
  },
  {
    pageNumber: 12,
    contents: [{
      type: 'narration',
      text: '신데렐라는 깜짝 놀라 도망치듯 달려갔고, 황금빛 마차는 어둠 속으로 사라졌답니다.',
      audioFiles: ['40.mp3'],
      illustration: '/images/storyimg/14.png',
    },
    {
      type: 'narration',
      text: '계단에서 떨어진 유리 구두 한 짝만이 달빛 아래 반짝였어요.',
      audioFiles: ['41.mp3'],
      illustration: '/images/storyimg/15.png',
    },
    ],
  },
  {
    pageNumber: 13,
    contents: [
      {
        type: 'narration',
        text: '한 짝만 남은 구두를 주워든 왕자는 시종들에게 말했습니다.',
        audioFiles: ['42.mp3'],
        illustration: '/images/storyimg/16.png',
      },
      {
        type: 'prince',
        text: '"들어라. 이 구두가 발에 꼭 맞는 여인과 결혼할 것이니 날이 밝으면 내가 직접 거리로 나서겠다."',
        audioFiles: ['43.mp3'],
        illustration: '/images/storyimg/16.png',
      },
    ],
  },
  {
    pageNumber: 14,
    contents: [
      {
        type: 'narration',
        text: '다음날, 왕자는 시종들을 이끌고 귀족들의 집을 하나씩 방문하게 되었습니다.',
        audioFiles: ['44.mp3'],
        illustration: '/images/storyimg/17.png',
      },
      {
        type: 'narration',
        text: '그들은 곧 신데렐라의 집에도 찾아왔어요.',
        audioFiles: ['45.mp3'],
        illustration: '/images/storyimg/17.png',
      },
      {
        type: 'narration',
        text: '두 언니도 구두를 신어봤지만 당연하게도 들어가지 않았습니다.',
        audioFiles: ['46.mp3'],
        illustration: '/images/storyimg/17.png',
      },
      {
        type: 'prince',
        text: '"다른 여인은 더 없소?"',
        audioFiles: ['48.mp3'],
        illustration: '/images/storyimg/17.png',
      },
      {
        type: 'narration',
        text: '"그럼요. 다른 아이는 없답니다."',
        audioFiles: ['49.mp3'],
        illustration: '/images/storyimg/17.png',
      },
    ],
  },
  {
    pageNumber: 15,
    contents: [
      {
        type: 'narration',
        text: '새엄마는 거짓말을 했지만, 이야기를 가만히 듣던 신데렐라는 문을 열고 나가 자신이 더 있음을 알렸습니다.',
        audioFiles: ['50.mp3'],
        illustration: '/images/storyimg/18.png',
      },
      {
        type: 'princess',
        text: '"아직 제가 신어 보지 않았어요."',
        audioFiles: ['51.mp3'],
        illustration: '/images/storyimg/18.png',
      },
      {
        type: 'narration',
        text: '깜짝 놀란 새엄마가 신데렐라에게 어서 들어가라 성화였지만, 가만히 신데렐라를 바라보던 왕자는 고개를 끄덕였습니다.',
        audioFiles: ['52.mp3'],
        illustration: '/images/storyimg/18.png',
      },
      {
        type: 'prince',
        text: '"모든 여인이 신어 보는 것이 조건이었습니다. 이리 와서 구두를 신어 보시죠."',
        audioFiles: ['53.mp3'],
        illustration: '/images/storyimg/18.png',
      },
    ],
  },
  {
    pageNumber: 16,
    contents: [
      {
        type: 'narration',
        text: '구두가 신데렐라의 발에 쏙 들어갔어요.',
        audioFiles: ['54.mp3'],
        illustration: '/images/storyimg/19.png',
      },
      {
        type: 'narration',
        text: '그때 요정 할머니가 나타나 마법으로 신데렐라를 다시 아름답게 만들어주었답니다.',
        audioFiles: ['55.mp3'],
        illustration: '/images/storyimg/19.png',
      },
      {
        type: 'narration',
        text: '왕자는 기뻐하며 신데렐라의 손을 잡았습니다.',
        audioFiles: ['56.mp3'],
        illustration: '/images/storyimg/19.png',
      },
      {
        type: 'prince',
        text: '"다시 만나고 싶었습니다. 이제 당신의 이름을 들을 수 있겠습니까?"',
        audioFiles: ['57.mp3'],
        illustration: '/images/storyimg/19.png',
      },
      {
        type: 'princess',
        text: '"저는 신데렐라예요."',
        audioFiles: ['58.mp3'],
        illustration: '/images/storyimg/19.png',
      },
    ],
  },
  {
    pageNumber: 17,
    contents: [{
      type: 'narration',
      text: '이 모든 상황을 지켜보던 새엄마와 새언니들은 무릎을 꿇고 신데렐라에게 그동안 괴롭혔던 것에 대해 용서를 빌었습니다.\n마음씨 고운 신데렐라는 그들을 용서했고, 왕자님과 함께 성으로 떠나 행복하게 살았답니다.',
      audioFiles: ['59.mp3'],
      illustration: '/images/storyimg/20.png',
    },
    {
      type: 'narration',
      text: '마음씨 고운 신데렐라는 그들을 용서했고, 왕자님과 함께 성으로 떠나 행복하게 살았답니다.',
      audioFiles: ['60.mp3'],
      illustration: '/images/storyimg/21.png',
    },
    ],
  },
];

export default storyData;
