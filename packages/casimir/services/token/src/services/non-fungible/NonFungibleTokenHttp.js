import { HttpService, serializeParams } from '@deip/http-service';
import { makeSingletonInstance } from '@deip/toolbox';

/**
 * Non-fungible token http transport
 */
export class NonFungibleTokenHttp {
  http = HttpService.getInstance();

  /**
   * Create new non-fungible token class
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async create(req) {
    return this.http.post('/api/v2/tokens/nft/create', req.getHttpBody());
  }

  /**
   * Create new non-fungible token class
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async updateNftCollectionMetadata(req) {
    return this.http.put(
      '/api/v2/tokens/nft/metadata/update',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  /**
   * Create new non-fungible token class
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async createNftCollectionMetadata(req) {
    return this.http.post(
      '/api/v2/tokens/nft/metadata/create',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  /**
   * Create item of non-fungible token collection
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async createNftItem(req) {
    return this.http.post('/api/v2/tokens/nft/item/create', req.getHttpBody());
  }

  /**
   * Moderate nft item metadata draft
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async moderateNftItemMetadataDraft(req) {
    return this.http.put('/api/v2/tokens/nft/item/metadata/draft/moderate',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() });
  }

  /**
   * Get nft item metadata draft by id
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getNftItemMetadataDraft(id) {
    return this.http.get(`/api/v2/tokens/nft/item/draft/${id}`);
  }

  /**
   * Get nft item
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getNftItem(nftCollectionId, nftItemId) {
    return this.http.get(`/api/v2/tokens/nft/item/${nftCollectionId}/${nftItemId}`);
  }

  /**
   * Get nft item list by nft collection
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getNftItemsListByNftCollection(id) {
    return this.http.get(`/api/v2/tokens/nft/items/nft-collection/${id}`);
  }

  /**
   * Create nft item metadata
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async createNftItemMetadata(req) {
    return this.http.post('/api/v2/tokens/nft/item/metadata/create',
      req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  /**
   * Get nft item metadata draft list by nft collection
   * @param {string} nftCollectionId
   * @returns {Promise<Object>}
   */
  async getNftItemMetadataDraftsByNftCollection(nftCollectionId) {
    return this.http.get(`/api/v2/tokens/nft/items/drafts/nft-collection/${nftCollectionId}`);
  }

  /**
   * Create nft item metadata draft
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async createNftItemMetadataDraft(req) {
    return this.http.post(
      '/api/v2/tokens/nft/item/metadata/draft/create',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  /**
   * Update nft item metadata draft
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async updateNftItemMetadataDraft(req) {
    return this.http.put(
      '/api/v2/tokens/nft/item/metadata/draft/update',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  /**
   * Delete nft item metadata draft
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async deleteNftItemMetadataDraft(req) {
    return this.http.put(
      '/api/v2/tokens/nft/item/metadata/draft/delete',
      req.getHttpBody(),
      { headers: req.getHttpHeaders() }
    );
  }

  /**
   * Get nft item list by portal
   * @param {string} portalId
   * @returns {Promise<Object>}
   */
  async getNftItemsListByPortal(portalId) {
    return this.http.get(`/api/v2/tokens/nft/items/portal/${portalId}`);
  }

  /**
   * Get public nft items list
   * @returns {Promise<Object>}
   */
  async getNftItemsList() {
    return this.http.get('/api/v2/tokens/nft/items/listing');
  }

  /**
   * Get nft items list paginated
   * @param {Object} q
   * @param {Object} q.sort 'asc', 'desc' by fields
   * @param {Number} q.page 0 or above
   * @param {Number} q.pageSize from 1 to 100
   * @param {Object} q.filter
   */
  async getNftItemsListPaginated(q) {
    const query = serializeParams(q);
    return this.http.get(`/api/v2/tokens/nft/items/listing-paginated?${query}`);
  }

  /**
   * Get nft item metadata drafts list paginated
   * @param {Object} query
   * @param {Object} query.sort 'asc', 'desc' by fields
   * @param {Number} query.page 0 or above
   * @param {Number} query.pageSize from 1 to 100
   * @param {Object} query.filter filter
   * @returns {Promise<Object>}
   */
  async getNftItemMetadataDraftsListPaginated(query) {
    const querySerialized = serializeParams(query);
    return this.http.get(`/api/v2/tokens/nft/items/drafts/listing-paginated?${querySerialized}`);
  }

  /**
   * Transfer non-fungible token to other owner
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async transfer(req) {
    return this.http.post('/api/v2/tokens/nft/transfer', req.getHttpBody());
  }

  /**
   * Get nft collection by id
   * @param {string} nftCollectionId
   * @returns {Promise<Object>}
   */
  async getNftCollection(nftCollectionId) {
    return this.http.get(`/api/v2/tokens/nft/${nftCollectionId}`);
  }

  /**
     * Get nft collections list by ids
     * @param {Array.<string>} nftCollectionIds
     * @returns {Promise<Object>}
     */
  async getNftCollectionsListByIds(nftCollectionIds) {
    const query = serializeParams({ nftCollectionIds });
    return this.http.get(`/api/v2/tokens/nfts?${query}`);
  }

  /**
     * Get default nft collection by issuer
     * @param {string} issuer
     * @returns {Promise<Object>}
     */
  async getDefaultNftCollectionByIssuer(issuer) {
    return this.http.get(`/api/v2/tokens/nft/default/${issuer}`);
  }

  /**
     * Get public nft collections list
     * @param {Object} filter
     * @param {Array} filter.attributes
     * @param {Array.<string>} filter.attributes
     * @returns {Promise<Object>}
     */
  async getNftCollectionsList(filter) {
    const query = serializeParams({ filter });
    return this.http.get(`/api/v2/tokens/nfts/listing?${query}`);
  }

  /**
     * Get nft collections list by issuer
     * @param {string} issuer
     * @returns {Promise<Object>}
     */
  async getNftCollectionsListByIssuer(issuer) {
    return this.http.get(`/api/v2/tokens/nfts/listing/issuer/${issuer}`);
  }

  /**
     * Get nft collection list for portal
     * @returns {Promise<Object>}
     */
  async getPortalNftCollectionList() {
    return this.http.get('/api/v2/tokens/nfts/portal/listing');
  }

  /** @type {() => NonFungibleTokenHttp} */
  static getInstance = makeSingletonInstance(() => new NonFungibleTokenHttp());
}
