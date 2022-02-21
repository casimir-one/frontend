import { ServiceBasePayload } from './servisePayload';

export type AssetBase = {
  symbol: string,
  precision: number
  issuer?: string,
};

export type Asset = AssetBase & {
  amount: number
};

export type AssetProjectTokenOption = {
  projectId: string,
  teamId: string,
  licenseRevenue: Record<string, unknown>
};

export type AssetHolder = {
  account: string,
  asset: Asset
};

// Payload data types

export type AssetCreateData = AssetBase & {
  maxSupply?: number,
  description?: string,
  projectTokenOption?: AssetProjectTokenOption,
  holders?: Array<AssetHolder>
};

export type AssetIssueData = AssetBase & {
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
