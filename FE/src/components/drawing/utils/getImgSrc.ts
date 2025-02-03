export const getBackgroundSrc = (templateId: number) => `public/images/coloringTemplates/${templateId.toString().padStart(2, '0')}/backgroundImg.png`;

export const getOutlineSrc = (templateId: number) => `public/images/coloringTemplates/${templateId.toString().padStart(2, '0')}/outlineImg.png`;
