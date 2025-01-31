export const getBackgroundSrc = (templateId: number) => `src/components/drawing/coloringTemplates/${templateId.toString().padStart(2, '0')}/backgroundImg.png`;

export const getOutlineSrc = (templateId: number) => `src/components/drawing/coloringTemplates/${templateId.toString().padStart(2, '0')}/outlineImg.png`;
