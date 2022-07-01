export const ATTRIBUTE_TYPES = [
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
] as const;

export const enum AttributeScope {
  NFT_COLLECTION = 'nftCollection',
  NFT_ITEM = 'nftItem',
  USER = 'user',
  TEAM = 'team'
}
