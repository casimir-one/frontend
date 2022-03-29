import { ServiceBasePayload } from './servicePayload';

// TODO: move transfer/exchange to tokens after service update

/**
 * Transfer asset data
 */
type AssetTransferData = {
  from: string,
  to: string
  asset: Record<string, unknown>
};

/**
 * Transfer asset payload
 */
export type AssetTransferPayload = ServiceBasePayload<AssetTransferData>;

// //////////////

/**
 * Exchange asset data
 */
type AssetExchangeData = {
  from: string,
  to: string
  fromAsset: Record<string, unknown>
  toAsset: Record<string, unknown>
};

/**
 * Exchange asset payload
 */
export type AssetExchangeProposalPayload = ServiceBasePayload<AssetExchangeData>;

// //////////////

/**
 * Deposit asset data
 */
type AssetDepositData = {
  redirectUrl: string,
  amount: number,
  currency: string,
  account: string,
  timestamp: number
};

/**
 * Deposit asset payload
 */
export type AssetDepositPayload = ServiceBasePayload<AssetDepositData>;
