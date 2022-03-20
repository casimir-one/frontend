import BaseChainRpc from './../../../base/rpc/BaseChainRpc';
import { isAddress, isValidPubKey, pubKeyToAddress, toHexFormat, fromHexFormat, encodeAddressFormat, addressToPubKey, toAddress } from './../utils';
import { u8aToHex, hexToString } from '@polkadot/util';
import SubstrateFungibleTokenDto from './response/dto/SubstrateFungibleTokenDto';
import SubstrateNonFungibleTokenDto from './response/dto/SubstrateNonFungibleTokenDto';
import SubstrateDaoDto from './response/dto/SubstrateDaoDto';
import SubstrateFungibleTokenBalanceDto from './response/dto/SubstrateFungibleTokenBalanceDto';
import SubstrateNonFungibleTokenInstancesDto from './response/dto/SubstrateNonFungibleTokenInstancesDto';
import SubstrateProjectDto from './response/dto/SubstrateProjectDto';
import SubstrateProjectContentDto from './response/dto/SubstrateProjectContentDto';
import SubstrateInvestmentOpportunityDto from './response/dto/SubstrateInvestmentOpportunityDto';
import SubstrateContractAgreementDto from './response/dto/SubstrateContractAgreementDto';
import SubstrateProposalDto from './response/dto/SubstrateProposalDto';
import SubstrateReviewDto from './response/dto/SubstrateReviewDto';
import SubstrateReviewUpvoteDto from './response/dto/SubstrateReviewUpvoteDto';
import SubstrateDomainDto from './response/dto/SubstrateDomainDto';
import SubstratePortalDto from './response/dto/SubstratePortalDto';



class SubstrateChainRpc extends BaseChainRpc {

  constructor(chainService, {
    coreAsset
  }) {

    const LIST_LIMIT = 1000;

    const getDaoIdByAddressAsync = async (address) => {
      const api = chainService.getChainNodeClient();
      const daoIdOpt = await api.query.deipDao.daoLookup(address);
      const daoId = daoIdOpt.isSome ? daoIdOpt.unwrap() : null;
      if (!daoId) return null;
      return fromHexFormat(u8aToHex(daoId));
    }

    const getFungibleTokenMetadataAsync = async (assetId) => {
      const api = chainService.getChainNodeClient();

      if (coreAsset.id === assetId)
        return {
          id: coreAsset.id,
          symbol: coreAsset.symbol,
          decimals: coreAsset.precision
        }

      const metadataOpt = await api.query.assets.assetMetadataMap(toHexFormat(assetId));
      const metadata = metadataOpt.isSome ? metadataOpt.unwrap().toJSON() : null;

      if (!metadata) return null;
      return {
        id: fromHexFormat(assetId),
        name: hexToString(metadata.name),
        symbol: hexToString(metadata.symbol),
        decimals: metadata.decimals
      };
    }

    const getNonFungibleTokenMetadataAsync = async (classIdInt) => {
      const api = chainService.getChainNodeClient();
      
      const metadataOpt = await api.query.parityTechUniques.classMetadataOf(classIdInt);
      const metadata = metadataOpt.isSome ? metadataOpt.unwrap().toJSON() : null;
      
      if (!metadata) return null;
      const dataStr = hexToString(metadata.data);
      const data = JSON.parse(dataStr);
      return {
        symbol: data.symbol
      };
    }


    const getCoreAssetBalanceDtoAsync = async (daoIdOrPubKeyOrAddress) => {
      const api = chainService.getChainNodeClient();
      const accountId = toAddress(daoIdOrPubKeyOrAddress, api.registry);

      const account = await api.query.system.account(accountId);
      const daoId = await getDaoIdByAddressAsync(accountId);

      const coreAssetBalanceDto = new SubstrateFungibleTokenBalanceDto({
        assetId: coreAsset.id,
        account: accountId,
        daoId: daoId,
        balance: account ? account.data.free.toString() : 0,
      }, {
        symbol: coreAsset.symbol,
        decimals: coreAsset.precision
      });

      return coreAssetBalanceDto;
    }

    const getCoreAssetBalancesDtosAsync = async () => {
      const api = chainService.getChainNodeClient();
      const accounts = await api.query.system.account.entries();
      const coreAssetBalancesDtos = await Promise.all(accounts.map((account) => {
        const accountId = encodeAddressFormat(account[0].slice(-32));
        const balance = account[1].data.free.toString();
        return getDaoIdByAddressAsync(accountId)
          .then((daoId) => {
            return new SubstrateFungibleTokenBalanceDto({
              assetId: coreAsset.id,
              account: accountId,
              balance: balance,
              daoId: daoId
            }, {
              symbol: coreAsset.symbol,
              decimals: coreAsset.precision
            });
          })
      }));

      return coreAssetBalancesDtos;
    }

    const getCoreAssetDtoAsync = async () => {
      const api = chainService.getChainNodeClient();
      const totalIssuance = await api.query.parityTechBalances.totalIssuance();
      const metadata = await getFungibleTokenMetadataAsync(coreAsset.id);
      return new SubstrateFungibleTokenDto({ 
        assetId: coreAsset.id, 
        supply: totalIssuance.toString(), 
        admin: "PROTOCOL" // TODO: make 'admin' optional for the core asset
      }, metadata);
    }

    const getPreProcessedDaoAsync = async (dao) => {
      const foundSignatories = await Promise.all(dao.authority.signatories
        .map((address) => getDaoIdByAddressAsync(address).then((daoId) => {
          return daoId ? { daoId: daoId, weight: 1 } : { pubKey: addressToPubKey(address), weight: 1 };
        }))
      );
      return { ...dao, foundSignatories };
    }


    const getPreProcessedProposalAsync = async (proposal) => {
      const authorDaoId = await getDaoIdByAddressAsync(proposal.author);
      const decisions = await Promise.all(Object.keys(proposal.decisions)
        .map(async (address) => {
          const daoId = await getDaoIdByAddressAsync(address);
          return {
            address: address,
            daoId: daoId ? daoId : null,
            state: proposal.decisions[address]
          };
        })
      );

      return { ...proposal, author: authorDaoId, decisions };
    };


    const getPreProcessedProjectContentAsync = async (content) => {
      const authors = await Promise.all(content.authors
        .map((address) => getDaoIdByAddressAsync(address).then((daoId) => {
          return {
            address: address,
            daoId: daoId ? daoId : null
          }
        }))
      );

      return { ...content, authors };
    };


    const getPreProcessedReviewAsync = async (review) => {
      const daoId = await getDaoIdByAddressAsync(review.author);
      const author = {
        address: review.author,
        daoId: daoId ? daoId : null
      };
      return { ...review, author };
    };


    const getPreProcessedReviewUpvoteAsync = async (upvote) => {
      const daoId = await getDaoIdByAddressAsync(upvote.dao);
      const upvoter = {
        address: upvote.dao,
        daoId: daoId ? daoId : null
      };
      return { ...upvote, upvoter };
    };


    const rpc = {

      sendTxAsync: (rawTx) => {
        return chainService.rpcToChainNode('author_submitExtrinsic', [rawTx]);
      },
      

      /* DAO */

      getAccountAsync: async (daoId) => {
        const dao = await chainService.rpcToChainNode("deipDao_get", [null, toHexFormat(daoId)]);
        if (!dao) return null;
        const item = await getPreProcessedDaoAsync(dao);
        return new SubstrateDaoDto(item);
      },

      getAccountsAsync: async (daoIds) => {
        const daos = await chainService.rpcToChainNode("deipDao_getMulti", [null, daoIds.map((daoId) => toHexFormat(daoId))]);
        const list = await Promise.all(daos.filter((dao) => !!dao).map(async (dao) => {
          const item = await getPreProcessedDaoAsync(dao);
          return new SubstrateDaoDto(item);
        }));
        return list;
      },

      getAccountsListAsync: async (startIdx = null, limit = LIST_LIMIT) => {
        const daos = await chainService.rpcToChainNode("deipDao_getList", [null, limit, toHexFormat(startIdx)]);
        const list = await Promise.all(daos.map(async ({ value: dao }) => {
          const item = await getPreProcessedDaoAsync(dao);
          return new SubstrateDaoDto(item);
        }));
        return list;
      },


      /* PORTAL */

      getPortalAsync: async (tenantId) => {
        const api = chainService.getChainNodeClient();
        const portalOpt = await api.query.deipPortal.portalRepository(toHexFormat(tenantId));
        const portal = portalOpt.isSome ? portalOpt.unwrap().toJSON() : null;
        if (!portal) return null;
        return new SubstratePortalDto(portal);
      },

      getPortalsAsync: async () => {
        const api = chainService.getChainNodeClient();
        const entries = await api.query.deipPortal.portalRepository.entries();
        const list = await Promise.all(entries.map(async ([{ args: [key] }, value]) => {
          const portal = value.toJSON();
          return new SubstratePortalDto(portal);
        }));
        return list;
      },


      /* PROJECT */

      getProjectAsync: async (projectId) => {
        const project = await chainService.rpcToChainNode("deip_getProject", [null, toHexFormat(projectId)]);
        if (!project) return null;
        return new SubstrateProjectDto(project);
      },

      getProjectsListAsync: async (startIdx = null, limit = LIST_LIMIT) => {
        const projects = await chainService.rpcToChainNode("deip_getProjectList", [null, limit, toHexFormat(startIdx)]);
        return projects.map(({ value: project }) => new SubstrateProjectDto(project));
      },

      getProjectsByTeamAsync: async (daoIdOrPubKeyOrAddress, startIdx = null, limit = LIST_LIMIT) => {
        const api = chainService.getChainNodeClient();
        const teamId = toAddress(daoIdOrPubKeyOrAddress, api.registry);
        const projects = await chainService.rpcToChainNode("deip_getProjectListByTeam", [null, teamId, limit, toHexFormat(startIdx)]);
        return projects.map(({ value: project }) => new SubstrateProjectDto(project));
      },

      getProjectsAsync: async (projectIds) => { 
        const projectsDtos = await this.getProjectsListAsync();
        return projectsDtos.filter((projectsDto) => projectIds.includes(projectsDto.projectId));
      },



      /*  PROJECT CONTENT */

      getProjectContentAsync: async (projectContentId) => {
        const content = await chainService.rpcToChainNode("deip_getProjectContent", [null, toHexFormat(projectContentId)]);
        if (!content) return null;
        const item = await getPreProcessedProjectContentAsync(content);
        return new SubstrateProjectContentDto(item);
      },

      getProjectContentsAsync: async (ids) => {
        const list = await Promise.all(ids.map((id) => this.getProjectContentAsync(id)));
        return list;
      },

      getProjectContentsListAsync: async (startIdx = null, limit = LIST_LIMIT) => {
        const contents = await chainService.rpcToChainNode("deip_getProjectContentList", [null, limit, toHexFormat(startIdx)]);
        const list = await Promise.all(contents.map(async ({ value: content }) => {
          const item = await getPreProcessedProjectContentAsync(content);
          return new SubstrateProjectContentDto(item);
        }));
        return list;
      },

      getProjectContentsByProjectAsync: async (projectId, startIdx = null, limit = LIST_LIMIT) => { 
        const contents = await chainService.rpcToChainNode("deip_getProjectContentListByProject", [null, toHexFormat(projectId), limit, toHexFormat(startIdx)]);
        const list = await Promise.all(contents.map(async ({ value: content }) => {
          const item = await getPreProcessedProjectContentAsync(content);
          return new SubstrateProjectContentDto(item);
        }));
        return list;
      },



      /* INVESTMENT OPPORTUNITY */

      getInvestmentOpportunityAsync: async (invstOppId) => {
        const api = chainService.getChainNodeClient();
        const opt = await api.query.deip.simpleCrowdfundingMap(`0x${invstOppId}`);
        const invstOppOpt = opt.toJSON();
        const invstOpp = invstOppOpt.externalId !== "0x0000000000000000000000000000000000000000" ? invstOppOpt : null;
        if (!invstOpp) return null;
        const targetAssetDto = await this.getFungibleTokenAsync(invstOpp.assetId);
        const sharesAssetsDtos = await Promise.all(invstOpp.shares.map(share => this.getFungibleTokenAsync(share.id)));
        return new SubstrateInvestmentOpportunityDto(invstOpp, targetAssetDto, sharesAssetsDtos);
      },


      getInvestmentOpportunitiesListAsync: async (startIdx = null, limit = LIST_LIMIT) => {
        const api = chainService.getChainNodeClient();
        const entries = await api.query.deip.simpleCrowdfundingMap.entries();
        const list = await Promise.all(entries.map(async ([{ args: [key] }, value]) => {
          const invstOpp = value.toJSON();
          const targetAssetDto = await this.getFungibleTokenAsync(invstOpp.assetId);
          const sharesAssetsDtos = await Promise.all(invstOpp.shares.map(share => this.getFungibleTokenAsync(share.id)));
          return new SubstrateInvestmentOpportunityDto(invstOpp, targetAssetDto, sharesAssetsDtos);
        }));
        return list;
      },



      /* CONTRACT AGREEMENT */

      getContractAgreementAsync: async (agreementId) => {
        const agreement = await chainService.rpcToChainNode("deip_getContractAgreement", [null, toHexFormat(agreementId)]);
        if (!agreement) return null;
        return new SubstrateContractAgreementDto(agreement);
      },

      getContractAgreementsListAsync: async (startIdx = null, limit = LIST_LIMIT) => {
        const agreements = await chainService.rpcToChainNode("deip_getContractAgreementList", [null, limit, toHexFormat(startIdx)]);
        return agreements.map(({ value: agreement }) => new SubstrateContractAgreementDto(agreement));
      },

      getContractAgreementsByTypeAsync: async (type, startIdx = null, limit = LIST_LIMIT) => {
        const agreements = await chainService.rpcToChainNode("deip_getContractAgreementListByType", [null, type, limit, toHexFormat(startIdx)]);
        return agreements.map(({ value: agreement }) => new SubstrateContractAgreementDto(agreement));
      },



      /* PROPOSAL */

      getProposalAsync: async (proposalId) => {
        const api = chainService.getChainNodeClient();
        const proposalOpt = await api.query.deipProposal.proposalRepository(`0x${proposalId}`);
        const proposal = proposalOpt.isSome ? proposalOpt.unwrap().toJSON() : null;
        if (!proposal) return null;
        const item = await getPreProcessedProposalAsync(proposal);
        return new SubstrateProposalDto(item);
      },

      getProposalsListAsync: async (startIdx = null, limit = LIST_LIMIT) => {
        const api = chainService.getChainNodeClient();
        const entries = await api.query.deipProposal.proposalRepository.entries();
        const list = await Promise.all(entries.map(async ([{ args: [key] }, value]) => {
          const item = await getPreProcessedProposalAsync(value.toJSON());
          return new SubstrateProposalDto(item);
        }));
        return list;
      },


      /* FUNGIBLE TOKEN  */

      getFungibleTokenAsync: async (assetId) => {
        if (assetId == coreAsset.id) {
          const coreAssetDto = await getCoreAssetDtoAsync();
          return coreAssetDto;
        }
        
        const asset = await chainService.rpcToChainNode("assets_getAsset", [null, toHexFormat(assetId)]);
        if (!asset) return null;
        const metadata = await getFungibleTokenMetadataAsync(assetId);
        return new SubstrateFungibleTokenDto({ assetId, ...asset }, metadata);
      },

      getFungibleTokenBySymbolAsync: async (symbol) => {
        const assetsDtos = await this.getFungibleTokenListAsync();
        const assetDto = assetsDtos.find((assetDto) => assetDto.symbol === symbol);
        return assetDto || null;
      },

      getFungibleTokenListAsync: async (startIdx = null, limit = LIST_LIMIT) => {
        const idx = startIdx ? [toHexFormat(startIdx)[0], toHexFormat(startIdx)[1]] : null;
        const assets = await chainService.rpcToChainNode("assets_getAssetList", [null, limit, idx]);
        const metadataList = await Promise.all(assets.map(({ key }) => getFungibleTokenMetadataAsync(fromHexFormat(key[0]))));
        const coreAssetDto = await getCoreAssetDtoAsync();
        return [...assets.map(({ key, value }, i) => (new SubstrateFungibleTokenDto({ assetId: key[0], ...value }, metadataList[i]))), coreAssetDto];
      },

      getProjectAssetsAsync: async (projectId) => {
        const api = chainService.getChainNodeClient();
        const assetsOpt = await api.query.assets.assetIdByProjectId(toHexFormat(projectId));

        const assets = assetsOpt.isSome ? assetsOpt.unwrap().toJSON() : null;
        if (!assets) return [];
        const assetsDtos = await Promise.all(assets.map((assetId) => this.getFungibleTokenAsync(assetId)));
        return assetsDtos;
      },



      /* FUNGIBLE TOKEN BALANCE */

      getFungibleTokenBalanceByOwnerAsync: async (daoIdOrPubKeyOrAddress, assetId) => {
        if (assetId == coreAsset.id) {
          const coreAssetBalanceDto = await getCoreAssetBalanceDtoAsync(daoIdOrPubKeyOrAddress);
          return coreAssetBalanceDto;
        }

        const api = chainService.getChainNodeClient();
        const accountId = toAddress(daoIdOrPubKeyOrAddress, api.registry);
        const balance = await chainService.rpcToChainNode("assets_getAssetBalanceByOwner", [null, accountId, toHexFormat(assetId)]);
        if (!balance) return null;
        let daoId;
        if (isAddress(daoIdOrPubKeyOrAddress)) {
          daoId = await getDaoIdByAddressAsync(daoIdOrPubKeyOrAddress);
        } else if (isValidPubKey(toHexFormat(daoIdOrPubKeyOrAddress))) {
          const id = await getDaoIdByAddressAsync(pubKeyToAddress(daoIdOrPubKeyOrAddress));
          daoId = id || daoIdOrPubKeyOrAddress;
        } else {
          daoId = daoIdOrPubKeyOrAddress;
        }
        const assetMetadata = await getFungibleTokenMetadataAsync(assetId);
        return new SubstrateFungibleTokenBalanceDto({ assetId, daoId, account: daoIdOrPubKeyOrAddress, ...balance }, assetMetadata);
      },

      getFungibleTokenBalanceByOwnerAndSymbolAsync: async (daoIdOrPubKeyOrAddress, symbol) => {
        if (symbol == coreAsset.symbol) {
          const coreAssetBalanceDto = await getCoreAssetBalanceDtoAsync(daoIdOrPubKeyOrAddress);
          return coreAssetBalanceDto;
        }

        const assetDto = await this.getFungibleTokenBySymbolAsync(symbol);
        if (!assetDto) return null;
        const balanceDto = await this.getFungibleTokenBalanceByOwnerAsync(daoIdOrPubKeyOrAddress, assetDto.assetId);
        return balanceDto;
      },

      getFungibleTokenBalancesByOwnerAsync: async (daoIdOrPubKeyOrAddress) => {
        const balancesDtos = await this.getFungibleTokenBalancesListAsync();
        return balancesDtos.filter((balanceDto) => balanceDto.account == daoIdOrPubKeyOrAddress);
      },

      getFungibleTokenBalancesAsync: async (assetId, startIdx = null, limit = LIST_LIMIT) => {
        if (assetId == coreAsset.id) {
          const coreAssetBalancesDtos = await getCoreAssetBalancesDtosAsync();
          return coreAssetBalancesDtos;
        }

        const balances = await chainService.rpcToChainNode("assets_getAssetBalanceListByAsset", [null, toHexFormat(assetId), limit, toHexFormat(startIdx)]);
        const daoIds = await Promise.all(balances.map((balance) => getDaoIdByAddressAsync(balance.account)));
        const assetMetadata = await getFungibleTokenMetadataAsync(assetId);
        return balances.map((balance, i) => (new SubstrateFungibleTokenBalanceDto({ assetId, daoId: daoIds[i], ...balance }, assetMetadata)));
      },

      getFungibleTokenBalancesBySymbolAsync: async (symbol, startIdx = null, limit = LIST_LIMIT) => {
        const assetDto = await this.getFungibleTokenBySymbolAsync(symbol);
        if (!assetDto) return [];
        const balancesDtos = await this.getFungibleTokenBalancesAsync(assetDto.assetId, startIdx, limit);
        return balancesDtos;
      },

      getFungibleTokenBalancesListAsync: async (startIdx = null, limit = LIST_LIMIT) => {
        const idx = startIdx ? [toHexFormat(startIdx)[0], toHexFormat(startIdx)[1]] : null;
        const balances = await chainService.rpcToChainNode("assets_getAssetBalanceList", [null, limit, idx]);
        const daoIds = await Promise.all(balances.map((balance) => getDaoIdByAddressAsync(balance.account)));
        const assetIds = balances
          .reduce((acc, balance) => {
            return acc.some((assetId) => assetId === fromHexFormat(balance.asset)) ? acc : [...acc, fromHexFormat(balance.asset)];
          }, []);
        const assetMetadataList = await Promise.all(assetIds.map((assetId) => getFungibleTokenMetadataAsync(assetId)));
        const coreAssetBalancesDtos = await getCoreAssetBalancesDtosAsync();
        return [...balances.map((balance, i) => (new SubstrateFungibleTokenBalanceDto(
          { assetId: balance.asset, daoId: daoIds[i], ...balance }, 
          assetMetadataList.find(metadata => metadata && metadata.id === fromHexFormat(balance.asset))
        ))), ...coreAssetBalancesDtos];
      },


      /* NON-FUNGIBLE TOKEN  */

      getNonFungibleTokenClassAsync: async (classId) => {
        const api = chainService.getChainNodeClient();
        const classIdOpt = await api.query.uniques.nftClassIdByDeipNftClassId(toHexFormat(classId));
        const classIdInt = classIdOpt.isSome ? classIdOpt.unwrap().toNumber() : null;
        if (!classIdInt) return null;

        const classOpt = await api.query.parityTechUniques.class(classIdInt);
        const nftClass = classOpt.isSome ? classOpt.unwrap().toJSON() : null;
        if (!nftClass) return null;

        const metadata = await getNonFungibleTokenMetadataAsync(classIdInt);
        return new SubstrateNonFungibleTokenDto({ classId, ...nftClass }, metadata);
      },


      getNonFungibleTokenClassesAsync: async () => {
        const api = chainService.getChainNodeClient();
        const entries = await api.query.parityTechUniques.class.entries();
        const list = await Promise.all(entries.map(async ([ { args: [key] } , value]) => {
          const nftClass = value.toJSON();
          const classIdInt = key.toNumber();
          const classIdOpt = await api.query.uniques.deipNftClassIdByNftClassId(classIdInt);
          const classId = classIdOpt.isSome ? classIdOpt.unwrap().toString() : null;
          const metadata = await getNonFungibleTokenMetadataAsync(classIdInt);
          return new SubstrateNonFungibleTokenDto({ classId, ...nftClass }, metadata);
        }));
        return list;
      },


      /* NON-FUNGIBLE TOKEN CLASS INSTANCES */

      getNonFungibleTokenClassInstancesByOwnerAsync: async (daoIdOrPubKeyOrAddress, classId) => {
        const api = chainService.getChainNodeClient();
        const accountId = toAddress(daoIdOrPubKeyOrAddress, api.registry);

        const classIdIntOpt = await api.query.uniques.nftClassIdByDeipNftClassId(toHexFormat(classId));
        const classIdInt = classIdIntOpt.isSome ? classIdIntOpt.unwrap().toNumber() : null;
        if (!classIdInt) return [];

        const classInstancesByAccount = await api.query.parityTechUniques.account.entries(accountId);
        const metadata = await getNonFungibleTokenMetadataAsync(classIdInt);

        const instancesIds = classInstancesByAccount.reduce((arr, [{ args: [accountId, u32, instanceId] }, value]) => {
          const classU32 = u32.toNumber();
          if (classIdInt == classU32)
            arr.push(instanceId.toNumber());
          return arr;
        }, []);

        return new SubstrateNonFungibleTokenInstancesDto({ classId, account: daoIdOrPubKeyOrAddress, instancesIds: instancesIds.sort() }, metadata);
      },


      getNonFungibleTokenClassesInstancesByOwnerAsync: async (daoIdOrPubKeyOrAddress) => {
        const api = chainService.getChainNodeClient();
        const accountId = toAddress(daoIdOrPubKeyOrAddress, api.registry);
        const classInstancesByAccount = await api.query.parityTechUniques.account.entries(accountId);

        const classesMap = await classInstancesByAccount.reduce(async (mapP, [{ args: [accountId, u32, instanceId] }, value]) => {
          const map = await mapP;
          const classU32 = u32.toNumber();

          if (!map[classU32]) {
            const metadata = await getNonFungibleTokenMetadataAsync(classU32);
            const classIdOpt = await api.query.uniques.deipNftClassIdByNftClassId(classU32);
            const classId = classIdOpt.isSome ? classIdOpt.unwrap().toString() : null;
            map[classU32] = {
              classId: classId,
              instancesIds: [instanceId.toNumber()],
              metadata: metadata
            }
          } else {
            map[classU32].instancesIds.push(instanceId.toNumber());
          }

          return map;
        }, Promise.resolve({}));

        return Object.keys(classesMap).map((classIdInt) => {
          const { classId, instancesIds, metadata } = classesMap[classIdInt];
          return new SubstrateNonFungibleTokenInstancesDto({ classId, account: daoIdOrPubKeyOrAddress, instancesIds: instancesIds.sort() }, metadata);
        });

      },


      /* REVIEW */

      getReviewAsync: async (reviewId) => {
        const review = await chainService.rpcToChainNode("deip_getReview", [null, toHexFormat(reviewId)]);
        if (!review) return null;
        const item = await getPreProcessedReviewAsync(review);
        return new SubstrateReviewDto(item);
      },

      getReviewsListAsync: async (startIdx = null, limit = LIST_LIMIT) => {
        const reviews = await chainService.rpcToChainNode("deip_getReviewList", [null, limit, toHexFormat(startIdx)]);
        const list = await Promise.all(reviews.map(async ({ value: review }) => {
          const item = await getPreProcessedReviewAsync(review);
          return new SubstrateReviewDto(item);
        }));
        return list;
      },

      getReviewsByProjectAsync: async (projectId, startIdx = null, limit = LIST_LIMIT) => {
        const reviews = await chainService.rpcToChainNode("deip_getReviewListByProject", [null, toHexFormat(projectId), limit, toHexFormat(startIdx)]);
        const list = await Promise.all(reviews.map(async ({ value: review }) => {
          const item = await getPreProcessedReviewAsync(review);
          return new SubstrateReviewDto(item);
        }));
        return list;
      },
      
      getReviewsByProjectContentAsync: async (contentId, startIdx = null, limit = LIST_LIMIT) => {
        const reviews = await chainService.rpcToChainNode("deip_getReviewListByProjectContent", [null, toHexFormat(contentId), limit, toHexFormat(startIdx)]);
        const list = await Promise.all(reviews.map(async ({ value: review }) => {
          const item = await getPreProcessedReviewAsync(review);
          return new SubstrateReviewDto(item);
        }));
        return list;
      },

      getReviewsByAuthorAsync: async (daoIdOrPubKeyOrAddress, startIdx = null, limit = LIST_LIMIT) => {
        const api = chainService.getChainNodeClient();
        const accountId = toAddress(daoIdOrPubKeyOrAddress, api.registry);
        const reviews = await chainService.rpcToChainNode("deip_getReviewListByReviewer", [null, accountId, limit, toHexFormat(startIdx)]);
        const list = await Promise.all(reviews.map(async ({ value: review }) => {
          const item = await getPreProcessedReviewAsync(review);
          return new SubstrateReviewDto(item);
        }));
        return list;
      },



      /* REVIEW UPVOTE */

      getReviewUpvotesByReviewAsync: async (reviewId, startIdx = null, limit = LIST_LIMIT) => {
        const reviewUpvotes = await chainService.rpcToChainNode("deip_getReviewUpvoteListByReview", [null, toHexFormat(reviewId), limit, toHexFormat(startIdx)]);
        const list = await Promise.all(reviewUpvotes.map(async ({ value: reviewUpvote }) => {
          const item = await getPreProcessedReviewUpvoteAsync(reviewUpvote);
          return new SubstrateReviewUpvoteDto(item);
        }));
        return list;
      },

      getReviewUpvotesByUpvoterAsync: async (daoIdOrPubKeyOrAddress, startIdx = null, limit = LIST_LIMIT) => {
        const api = chainService.getChainNodeClient();
        const accountId = toAddress(daoIdOrPubKeyOrAddress, api.registry);
        const reviewsUpvotes = await chainService.rpcToChainNode("deip_getReviewUpvoteListByUpvoter", [null, accountId, limit, toHexFormat(startIdx)]);
        const list = await Promise.all(reviewsUpvotes.map(async ({ value: reviewUpvote }) => {
          const item = await getPreProcessedReviewUpvoteAsync(reviewUpvote);
          return new SubstrateReviewUpvoteDto(item);
        }));
        return list;
      },



      /* DOMAIN */

      getDomainAsync: async (domainId) => {
        const domain = await chainService.rpcToChainNode("deip_getDomain", [null, toHexFormat(domainId)]);
        if (!domain) return null;
        return new SubstrateDomainDto(domain);
      },

      getDomainsListAsync: async (startIdx = null, limit = LIST_LIMIT) => {
        const domains = await chainService.rpcToChainNode("deip_getDomainList", [null, limit, toHexFormat(startIdx)]);
        return domains.map(({ value: domain }) => {
          return new SubstrateDomainDto(domain);
        });
      },



      // TODO:

      getProjectNdaByProjectAsync: async function (id) { return [] },
      setBlockAppliedCallbackAsync: async function (cb) { throw Error(`Not implemented exception`); },
      getStateAsync: async function (path) { throw Error(`Not implemented exception`); },
      getConfigAsync: async function () { throw Error(`Not implemented exception`);},
      getDynamicGlobalPropertiesAsync: async function () { throw Error(`Not implemented exception`); },
      getChainPropertiesAsync: async function () { throw Error(`Not implemented exception`); },
      getWitnessScheduleAsync: async function () { throw Error(`Not implemented exception`); },
      getHardforkVersionAsync: async function () { throw Error(`Not implemented exception`); },
      getNextScheduledHardforkAsync: async function () { throw Error(`Not implemented exception`); },
      getAccountReferencesAsync: async function (accountId) { throw Error(`Not implemented exception`); },
      getAccountCountAsync: async function () { throw Error(`Not implemented exception`); },
      getAccountHistoryAsync: async function (account, from, limit) { throw Error(`Not implemented exception`); },
      getOwnerHistoryAsync: async function (account) { throw Error(`Not implemented exception`); },
      getRecoveryRequestAsync: async function (account) { throw Error(`Not implemented exception`); },
      getWithdrawRoutesAsync: async function (account, withdrawRouteType) { throw Error(`Not implemented exception`); },
      getAccountBandwidthAsync: async function (account, bandwidthType) { throw Error(`Not implemented exception`); },
      getTransactionHexAsync: async function (trx) { throw Error(`Not implemented exception`); },
      getKeyReferencesAsync: async function (keys, fullHistory) { throw Error(`Not implemented exception`); },
      getAccountKeyReferencesAsync: async function (accounts, fullHistory) { throw Error(`Not implemented exception`); },
      getTeamReferencesAsync: async function (teams, fullHistory) { throw Error(`Not implemented exception`); },
      getTeamMemberReferencesAsync: async function (members, fullHistory) { throw Error(`Not implemented exception`); },
      getBlockAsync: async function (blockNum) { throw Error(`Not implemented exception`); },
      getOpsHistoryAsync: async function (from, limit, opt) { throw Error(`Not implemented exception`); },
      getTransactionAsync: async function (trxId) { throw Error(`Not implemented exception`); },
      getBlockHeaderAsync: async function (blockNum) { throw Error(`Not implemented exception`); },
      getOpsInBlockAsync: async function (blockNum, onlyVirtual) { throw Error(`Not implemented exception`); },
      getBlocksHistoryAsync: async function (from, limit) { throw Error(`Not implemented exception`); },
      getAccountDeipToDeipTransfersAsync: async function (account, from, limit) { throw Error(`Not implemented exception`); },
      getRequiredSignaturesAsync: async function (trx, availableKeys) { throw Error(`Not implemented exception`); },
      getPotentialSignaturesAsync: async function (trx) { throw Error(`Not implemented exception`); },
      verifyAuthorityAsync: async function (trx) { throw Error(`Not implemented exception`); },
      getWitnessesAsync: async function (witnessIds) { throw Error(`Not implemented exception`); },
      getWitnessByAccountAsync: async function (accountName) { throw Error(`Not implemented exception`); },
      getWitnessesByVoteAsync: async function (from, limit) { throw Error(`Not implemented exception`); },
      lookupWitnessAccountsAsync: async function (lowerBoundName, limit) { throw Error(`Not implemented exception`); },
      getWitnessCountAsync: async function () { throw Error(`Not implemented exception`); },
      getActiveWitnessesAsync: async function () { throw Error(`Not implemented exception`); },
      getRewardFundAsync: async function (name) { throw Error(`Not implemented exception`); },
      loginAsync: async function (username, password) { throw Error(`Not implemented exception`); },
      getApiByNameAsync: async function (databaseApi) { throw Error(`Not implemented exception`); },
      getVersionAsync: async function () { throw Error(`Not implemented exception`); },
      broadcastTransactionAsync: async function (trx) { throw Error(`Not implemented exception`); },
      broadcastTransactionWithCallbackAsync: async function (confirmationCallback, trx) { throw Error(`Not implemented exception`); },
      broadcastBlockAsync: async function (b) { throw Error(`Not implemented exception`); },
      setMaxBlockAgeAsync: async function (maxBlockAge) { throw Error(`Not implemented exception`); },
      getTeamAsync: async function (account) { throw Error(`Not implemented exception`); },
      lookupTeamsAsync: async function (lowerBound, limit) { throw Error(`Not implemented exception`); },
      getTeamsAsync: async function (ids) { throw Error(`Not implemented exception`); },
      getTeamByPermlinkAsync: async function (permlink) { throw Error(`Not implemented exception`); },
      getReviewVotesByReviewAsync: async function (reviewId) { throw Error(`Not implemented exception`); },
      getSchemaAsync: async function () { throw Error(`Not implemented exception`); },
      getExpiringVestingDelegationsAsync: async function (account, from, limit) { throw Error(`Not implemented exception`); },
      lookupDomainsAsync: async function (lowerBound, limit) { throw Error(`Not implemented exception`); },
      getDomainByNameAsync: async function (name) { throw Error(`Not implemented exception`); },
      getDomainsByParentAsync: async function (parentId) { throw Error(`Not implemented exception`); },
      getProjectByPermlinkAsync: async function (teamId, permlink) { throw Error(`Not implemented exception`); },
      getProjectByAbsolutePermlinkAsync: async function (teamPermlink, projectPermlink) { throw Error(`Not implemented exception`); },
      getProjectLicenseAsync: async function (id) { throw Error(`Not implemented exception`); },
      getProjectLicensesAsync: async function (ids) { throw Error(`Not implemented exception`); },
      getProjectLicensesByLicenseeAsync: async function (licensee) { throw Error(`Not implemented exception`); },
      getProjectLicensesByLicenserAsync: async function (licenser) { throw Error(`Not implemented exception`); },
      getProjectLicensesByProjectAsync: async function (projectId) { throw Error(`Not implemented exception`); },
      getProjectLicensesByLicenseeAndProjectAsync: async function (licensee, projectId) { throw Error(`Not implemented exception`); },
      getProjectLicensesByLicenseeAndLicenserAsync: async function (licensee, licenser) { throw Error(`Not implemented exception`); },
      getProjectContentByTypeAsync: async function (projectId, type) { throw Error(`Not implemented exception`); },
      getProjectContentByPermlinkAsync: async function (projectId, permlink) { throw Error(`Not implemented exception`); },
      getProjectContentByAbsolutePermlinkAsync: async function (teamPermlink, projectPermlink, projectContentPermlink) { throw Error(`Not implemented exception`); },
      getExpertTokenAsync: async function (id) { throw Error(`Not implemented exception`); },
      getExpertTokensByAccountNameAsync: async function (accountName) { throw Error(`Not implemented exception`); },
      getExpertTokensByDomainAsync: async function (domainId) { throw Error(`Not implemented exception`); },
      getTeamTokenByAccountAndProjectGroupIdAsync: async function (account, teamId) { throw Error(`Not implemented exception`); },
      getProjectTokenSalesByProjectAsync: async function (projectId) { throw Error(`Not implemented exception`); },
      getProjectTokenSaleContributionsByProjectTokenSaleAsync: async function (tokenSaleId) { throw Error(`Not implemented exception`); },
      getProjectTokenSaleContributionsByContributorAsync: async function (owner) { throw Error(`Not implemented exception`); },
      getDomainsByProjectAsync: async function (projectId) { throw Error(`Not implemented exception`); },
      checkTeamExistenceByPermlinkAsync: async function (name) { throw Error(`Not implemented exception`); },
      checkProjectExistenceByPermlinkAsync: async function (teamId, title) { throw Error(`Not implemented exception`); },
      checkProjectContentExistenceByPermlinkAsync: async function (projectId, title) { throw Error(`Not implemented exception`); },
      getExpertiseContributionByProjectContentAndDomainAsync: async function (projectContentId, domainId) { throw Error(`Not implemented exception`); },
      getExpertiseContributionsByProjectAsync: async function (projectId) { throw Error(`Not implemented exception`); },
      getExpertiseContributionsByProjectAndDomainAsync: async function (projectId, domainId) { throw Error(`Not implemented exception`); },
      getExpertiseContributionsByProjectContentAsync: async function (projectContentId) { throw Error(`Not implemented exception`); },
      lookupWitnessAccountsAsync: async function (lowerBoundName, limit) { throw Error(`Not implemented exception`); },
      getWitnessByAccountAsync: async function (accountName) { throw Error(`Not implemented exception`); },
      getReviewsAsync: async function (ids) { throw Error(`Not implemented exception`); },
      getProjectTokensByAccountNameAsync: async function (accountName) { throw Error(`Not implemented exception`); },
      getProjectTokensByProjectIdAsync: async function (projectId) { throw Error(`Not implemented exception`); },
      getProjectTokenByAccountNameAndProjectIdAsync: async function (accountName, projectId) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalByIdAsync: async function (id) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalsByInitiatorAsync: async function (initiator) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalsByClaimerAndDomainAsync: async function (claimer, domainId) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalByDomainInitiatorAndClaimerAsync: async function (domainId, initiator, claimer) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalsByDomainAsync: async function (domainId) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalVoteByIdAsync: async function (id) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalVotesByExpertiseAllocationProposalIdAsync: async function (expertiseAllocationProposalId) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalVoteByVoterAndExpertiseAllocationProposalIdAsync: async function (voter, expertiseAllocationProposalId) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalVotesByVoterAndDomainIdAsync: async function (voter, domainId) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalVotesByVoterAsync: async function (voter) { throw Error(`Not implemented exception`); },
      getAccountsByExpertDomainAsync: async function (domainId, from, limit) { throw Error(`Not implemented exception`); },
      getFundingOpportunityAnnouncementAsync: async function (id) { throw Error(`Not implemented exception`); },
      getFundingOpportunityAnnouncementByNumberAsync: async function (number) { throw Error(`Not implemented exception`); },
      getFundingOpportunityAnnouncementsByOrganizationAsync: async function (teamId) { throw Error(`Not implemented exception`); },
      getFundingOpportunityAnnouncementsListingAsync: async function (page, limit) { throw Error(`Not implemented exception`); },
      getGrantWithAnnouncedApplicationWindowAsync: async function (id) { throw Error(`Not implemented exception`); },
      getGrantsWithAnnouncedApplicationWindowByGrantorAsync: async function (grantor) { throw Error(`Not implemented exception`); },
      getGrantApplicationAsync: async function (id) { throw Error(`Not implemented exception`); },
      getGrantApplicationsByGrantAsync: async function (grantId) { throw Error(`Not implemented exception`); },
      getGrantApplicationsByProjectIdAsync: async function (projectId) { throw Error(`Not implemented exception`); },
      getGrantApplicationReviewAsync: async function (id) { throw Error(`Not implemented exception`); },
      getGrantApplicationReviewsByAuthorAsync: async function (author) { throw Error(`Not implemented exception`); },
      getGrantApplicationReviewByAuthorAndApplicationAsync: async function (author, grantApplicaitonId) { throw Error(`Not implemented exception`); },
      getGrantApplicationReviewsByGrantApplicationAsync: async function (grantApplicationId) { throw Error(`Not implemented exception`); },
      getAwardAsync: async function (awardNumber) { throw Error(`Not implemented exception`); },
      getAwardsByFundingOpportunityAsync: async function (fundingOpportunityNumber) { throw Error(`Not implemented exception`); },
      getAwardRecipientAsync: async function (id) { throw Error(`Not implemented exception`); },
      getAwardRecipientsByAwardAsync: async function (awardNumber) { throw Error(`Not implemented exception`); },
      getAwardRecipientsByAccountAsync: async function (awardee) { throw Error(`Not implemented exception`); },
      getAwardRecipientsByFundingOpportunityAsync: async function (number) { throw Error(`Not implemented exception`); },
      getAwardWithdrawalRequestAsync: async function (awardNumber, paymentNumber) { throw Error(`Not implemented exception`); },
      getAwardWithdrawalRequestsByAwardAsync: async function (awardNumber) { throw Error(`Not implemented exception`); },
      getAwardWithdrawalRequestsByAwardAndSubawardAsync: async function (awardNumber, subawardNumber) { throw Error(`Not implemented exception`); },
      getAwardWithdrawalRequestsByAwardAndStatusAsync: async function (awardNumber, status) { throw Error(`Not implemented exception`); },
      getWithdrawalRequestsHistoryByAwardNumberAsync: async function (awardNumber) { throw Error(`Not implemented exception`); },
      getWithdrawalRequestHistoryByAwardAndPaymentNumberAsync: async function (awardNumber, paymentNumber) { throw Error(`Not implemented exception`); },
      getWithdrawalRequestsHistoryByAwardAndSubawardNumberAsync: async function (awardNumber, subawardNumber) { throw Error(`Not implemented exception`); },
      getFungibleTokenByIssuerAsync: async function (issuer) { throw Error(`Not implemented exception`); },
      getFungibleTokenByTypeAsync: async function (type) { throw Error(`Not implemented exception`); },
      getFundingTransactionAsync: async function (id) { throw Error(`Not implemented exception`); },
      getFundingTransactionsBySenderOrganisationAsync: async function (senderOrganisationId) { throw Error(`Not implemented exception`); },
      getFundingTransactionsByReceiverOrganisationAsync: async function (receiverOrganisationId) { throw Error(`Not implemented exception`); },
      getAssetStatisticsAsync: async function (symbol) { throw Error(`Not implemented exception`); },
      getProjectNdaAsync: async function (id) { throw Error(`Not implemented exception`); },
      getProjectNdaByCreatorAsync: async function (creator) { throw Error(`Not implemented exception`); },
      getProjectNdaByHashAsync: async function (hash) { throw Error(`Not implemented exception`); },
      getNdaContractContentAccessRequestAsync: async function (id) { throw Error(`Not implemented exception`); },
      getNdaContractContentAccessRequestsByNdaAsync: async function (ndaId) { throw Error(`Not implemented exception`); },
      getNdaContractContentAccessRequestsByRequesterAsync: async function (requester) { throw Error(`Not implemented exception`); },
      getNdaContractRequestAsync: async function (id) { throw Error(`Not implemented exception`); },
      getNdaContractRequestsByContractIdAsync: async function (contractId) { throw Error(`Not implemented exception`); },
      getNdaContractRequestsByRequesterAsync: async function (requester) { throw Error(`Not implemented exception`); },
      getNdaContractRequestByContractIdAndHashAsync: async function (contractId, encryptedPayloadHash) { throw Error(`Not implemented exception`); },
      getSubscriptionAsync: async function (id) { throw Error(`Not implemented exception`); },
      getSubscriptionByTeamIdAsync: async function (teamId) { throw Error(`Not implemented exception`); },
      getSubscriptionsByOwnerAsync: async function (owner) { throw Error(`Not implemented exception`); },
      getOrganisationHistoryAsync: async function (organisationId) { throw Error(`Not implemented exception`); },
      getContentHistoryByHashAsync: async function (contentHash) { throw Error(`Not implemented exception`); },
      getContentHistoryByProjectAndHashAsync: async function (projectId, contentHash) { throw Error(`Not implemented exception`); },
      getContributionsHistoryByContributorAsync: async function (investor) { throw Error(`Not implemented exception`); },
      getContributionsHistoryByContributorAndProjectAsync: async function (investor, projectId) { throw Error(`Not implemented exception`); },
      getContributionsHistoryByProjectAsync: async function (projectId) { throw Error(`Not implemented exception`); },
      getContributionsHistoryByTokenSaleAsync: async function (projectTokenSaleId) { throw Error(`Not implemented exception`); },
      getContentReferencesAsync: async function (projectContentId) { throw Error(`Not implemented exception`); },
      getContentReferences2Async: async function (projectContentId) { throw Error(`Not implemented exception`); },
      getContentsReferToContentAsync: async function (projectContentId) { throw Error(`Not implemented exception`); },
      getContentsReferToContent2Async: async function (projectContentId) { throw Error(`Not implemented exception`); },
      getProjectContentEciHistoryAsync: async function (projectContentId, cursor, domainFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getProjectContentEciStatsAsync: async function (projectContentId, domainFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getProjectContentsEciStatsAsync: async function (domainFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getProjectEciHistoryAsync: async function (projectId, cursor, domainFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getProjectEciStatsAsync: async function (projectId, domainFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getProjectsEciStatsAsync: async function (domainFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getAccountEciHistoryAsync: async function (account, cursor, domainFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getAccountEciStatsAsync: async function (account, domainFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getAccountsEciStatsAsync: async function (domainFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getDomainsEciStatsHistoryAsync: async function (fromFilter, toFilter, stepFilter) { throw Error(`Not implemented exception`); },
      getDomainEciHistoryAsync: async function (domainFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getDomainsEciLastStatsAsync: async function () { throw Error(`Not implemented exception`); },
      getAccountRevenueHistoryBySecurityTokenAsync: async function (account, securityTokenId, cursor, step, targetAssetSymbol) { throw Error(`Not implemented exception`); },
      getAccountRevenueHistoryAsync: async function (account, cursor) { throw Error(`Not implemented exception`); },
      getSecurityTokenRevenueHistoryAsync: async function (securityTokenId, cursor) { throw Error(`Not implemented exception`); },
      getProposalsBySignerAsync: async function (account) { throw Error(`Not implemented exception`); },
      getProposalsBySignersAsync: async function (accounts) { throw Error(`Not implemented exception`); },
      getProposalStateAsync: async function (id) { throw Error(`Not implemented exception`); },
      getProposalsStatesAsync: async function (ids) { throw Error(`Not implemented exception`); },
      lookupProposalsStatesAsync: async function (lowerBound, limit) { throw Error(`Not implemented exception`); },
      getContractAgreementsByCreatorAsync: (creator) => { throw Error(`Not implemented exception`); },
    }
    return super(rpc);
  }
}


export default SubstrateChainRpc;