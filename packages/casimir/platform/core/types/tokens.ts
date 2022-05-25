import { ServiceBasePayload } from './servicePayload';

/**
 * Project reference
 * @todo: discard in future
 */
type TokenMetadata = {
  projectId: string,
  teamId?: string,
  licenseRevenue?: { holdersShare: string }
};

/**
 * Token issuer
 */
type TokenIssuer = {
  issuer: string
};

/**
 * Common token payload data
 */
type CommonTokenData = TokenIssuer & {
  description?: string,
  metadata?: TokenMetadata
};

export type TokenTransferData<T> = {
  from: string,
  to: string,
  token: T
};

// //////////////////////////

/**
 * Base for fungible token
 */
type FungibleTokenBase = {
  id: string,
  symbol: string,
  precision: number,
  amount: string,
};

/**
 * Fungible token holder
 */
type FungibleTokenHolder = {
  account: string,
  asset: FungibleTokenBase
};

/**
 * Fungible token data for creation payload
 */
export type FungibleTokenCreateData = Omit<FungibleTokenBase, 'amount' | 'id'> & CommonTokenData & {
  /** Maximum possible amount that can be issued */
  maxSupply: string,
  /** Minimum amount that DAO can have on the balance */
  minBalance: string,
  holders?: Array<FungibleTokenHolder>
};

/**
 * Fungible token data for issue payload
 */
export type FungibleTokenIssueData = TokenIssuer & Omit<FungibleTokenBase, 'id'> & {
  tokenId: string, // entityId from FungibleTokenCmdPayload
  recipient: string
};

/**
 */
type FungibleTokenTransferData = TokenTransferData<FungibleTokenBase>;

/**
 * Fungible token creation payload
 */
export type FungibleTokenCreatePayload = ServiceBasePayload<FungibleTokenCreateData>;

/**
 * Fungible token issue payload
 */
export type FungibleTokenIssuePayload = ServiceBasePayload<FungibleTokenIssueData>;

/**
 * Fungible token transfer payload
 */
export type FungibleTokenTransferPayload = ServiceBasePayload<FungibleTokenTransferData>;

// //////////////////////////

type NonFungibleTokenBase = {
  nftCollectionId: string, // entityId from NonFungibleTokenCmdPayload
  nftItemId: string
};

/**
 * Non-fungible token data for creation payload
 */
export type NonFungibleTokenCreateData = {
  name: string,
  metadata: Record<string, unknown>
} & CommonTokenData;

/**
 * Non-fungible token data for issue payload
 */
export type NonFungibleTokenIssueData = TokenIssuer & NonFungibleTokenBase & {
  recipient: string
};

/**
 */
type NonFungibleTokenTransferData = TokenTransferData<NonFungibleTokenBase>;

/**
 * Non-fungible token creation payload
 */
export type NonFungibleTokenCreatePayload = ServiceBasePayload<NonFungibleTokenCreateData>;

/**
 * Non-fungible token issue payload
 */
export type NonFungibleTokenIssuePayload = ServiceBasePayload<NonFungibleTokenIssueData>;

/**
 * Non-fungible token transfer payload
 */
export type NonFungibleTokenTransferPayload = ServiceBasePayload<NonFungibleTokenTransferData>;

// //////////////////////////

/**
 */
type TokenSwapProposalParty = {
  account: string,
  token: FungibleTokenBase | NonFungibleTokenBase
};

/**
 */
type TokenSwapProposalData = {
  party1: TokenSwapProposalParty
  party2: TokenSwapProposalParty
};

/**
 * Token swap payload
 */
export type TokenSwapProposalPayload = ServiceBasePayload<TokenSwapProposalData>;
