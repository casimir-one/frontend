// for types in future
// export const ASSET_TYPE = ['coin', 'nft', 'core'] as const;
// export const DEPOSIT_REQUEST_STATUS = ['pending', 'approved', 'rejected'] as const;

export const enum AssetType {
  COIN = 1,
  NFT,
  CORE
}

export const enum DepositRequestStatus {
  PENDING = 1,
  APPROVED,
  REJECTED
}
