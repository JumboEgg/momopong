import { DrawingTemplate } from '../types/drawing';
import { getBackgroundSrc, getOutlineSrc } from '../utils/getImgSrc';

// 그림 목록
const drawingTemplate: DrawingTemplate[] = [
  {
    storyId: 1,
    templateId: 1,
    name: '신데렐라의 구두',
    bgSrc: getBackgroundSrc(1),
    olSrc: getOutlineSrc(1),
  },
  {
    storyId: 1,
    templateId: 2,
    name: '신데렐라의 고급 구두',
    bgSrc: getBackgroundSrc(2),
    olSrc: getOutlineSrc(2),
  },
  {
    storyId: 1,
    templateId: 3,
    name: '신데렐라',
    bgSrc: getBackgroundSrc(3),
    olSrc: getOutlineSrc(3),
  },
  {
    storyId: 1,
    templateId: 4,
    name: '신데렐라의 왕자',
    bgSrc: getBackgroundSrc(4),
    olSrc: getOutlineSrc(4),
  },
];

export default drawingTemplate;
