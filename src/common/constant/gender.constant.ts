export const GENDER_VALUES = ['Nam', 'Nữ'] as const;

export type Gender = (typeof GENDER_VALUES)[number];
