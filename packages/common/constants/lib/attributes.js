// export const ATTR_SCOPES = ['project', 'team', 'user'] as const;
// export type AttrScopes = typeof ATTR_SCOPES[number];
//
// export const ATTR_TYPES = ['text', 'textarea'] as const;
// export type AttrTypes = typeof ATTR_TYPES[number];
//
// export type AttrTypeInfo = {
//   type: AttrTypes,
//   label: string,
//   icon: string,
//   props?: Object,
//   rule?: string,
//   scopes?: AttrScopes[], // which scopes allowed
// }
//
// const baseAttributes: AttrTypeInfo[] = []

const ATTR_TYPES = [
  'text',
  'textarea',
  'richText',
  'select',
  'switch',
  'checkbox',
  'date',
  'date-time',
  'number',
  'file',
  'image',
  'url',
  'videoUrl',
  'avatar',
  'location',
  'custom'
];

const ATTR_SCOPES = [
  'project',
  'user',
  'team'
];

export {
  ATTR_TYPES,
  ATTR_SCOPES
};
