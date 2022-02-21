import { ServiceBasePayload } from './servicePayload';

export type Asset = {
  _id: string,
  symbol: string,
  precision: number,
  amount: number
};

export type AssetProjectTokenOption = {
  projectId: string,
  teamId: string,
  licenseRevenue: Record<string, unknown>
};

export type AssetCreateHolder = {
  account: string,
  asset: Omit<Asset, '_id'>
};

// Payload data types

export type AssetCreateData = Omit<Asset, '_id' | 'amount'> & {
  issuer?: string,
  maxSupply?: number,
  description?: string,
  projectTokenOption?: AssetProjectTokenOption,
  holders?: Array<AssetCreateHolder>
};

export type AssetIssueData = {
  issuer: string,
  recipient: string
  asset: Asset
};

export type AssetTransferPayloadData = {
  from: string,
  to: string
  asset: Asset
};

export type AssetExchangePayloadData = {
  from: string,
  to: string
  fromAsset: Asset
  toAsset: Asset
};

export type AssetDepositPayloadData = {
  redirectUrl: string,
  amount: number,
  currency: string,
  account: string,
  timestamp: number
};

// Payload types

export type AssetCreatePayload = ServiceBasePayload<AssetCreateData>;
export type AssetIssuePayload = ServiceBasePayload<AssetIssueData>;
export type AssetTransferPayload = ServiceBasePayload<AssetTransferPayloadData>;
export type AssetExchangePayload = ServiceBasePayload<AssetExchangePayloadData>;
export type AssetDepositPayload = ServiceBasePayload<AssetDepositPayloadData>;
