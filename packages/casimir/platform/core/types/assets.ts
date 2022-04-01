import { ServiceBasePayload } from './servicePayload';

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
