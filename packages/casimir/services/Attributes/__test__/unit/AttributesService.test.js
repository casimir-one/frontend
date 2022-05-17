import { AttributesService } from '../../lib/AttributesService';

const mockGetList = jest.fn();
const mockGetListByScope = jest.fn();
const mockGetOne = jest.fn();
const mockGetNetworkAttributes = jest.fn();
const mockGetNetworkAttributesByScope = jest.fn();
const mockGetSystemAttributes = jest.fn();
const mockDelete = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockGetSettings = jest.fn();
const mockUpdateSettings = jest.fn();

jest.mock('../../lib/AttributesHttp.js', () => ({
  AttributesHttp: {
    getInstance: () => ({
      getList: mockGetList,
      getListByScope: mockGetListByScope,
      getOne: mockGetOne,
      getNetworkAttributes: mockGetNetworkAttributes,
      getNetworkAttributesByScope: mockGetNetworkAttributesByScope,
      getSystemAttributes: mockGetSystemAttributes,
      delete: mockDelete,
      create: mockCreate,
      update: mockUpdate,
      getSettings: mockGetSettings,
      updateSettings: mockUpdateSettings
    })
  }
}));

jest.mock('@deip/commands', () => ({
  CreateAttributeCmd: jest.fn(),
  UpdateAttributeCmd: jest.fn(),
  DeleteAttributeCmd: jest.fn(),
  UpdateAttributeSettingsCmd: jest.fn()
}));

jest.mock('@deip/messages', () => ({
  // eslint-disable-next-line object-shorthand,func-names
  JsonDataMsg: function () {
    return { message: 'testMessage' };
  }
}));

const attributesService = AttributesService.getInstance();

describe('attributesService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be instance of attributesService', () => {
    expect(attributesService).toBeInstanceOf(AttributesService);
  });

  describe('getList', () => {
    it('should call attributesHttp.getList', () => {
      attributesService.getList();
      expect(mockGetList).toBeCalled();
    });
  });

  describe('getListByScope', () => {
    it('should call attributesHttp.getListByScope with right scope', () => {
      attributesService.getListByScope('testScope');
      expect(mockGetListByScope).toBeCalledWith('testScope');
    });
  });

  describe('getOne', () => {
    it('should call attributesHttp.getOne with right id', () => {
      attributesService.getOne('testId');
      expect(mockGetOne).toBeCalledWith('testId');
    });
  });

  describe('getNetworkAttributes', () => {
    it('should call attributesHttp.getNetworkAttributes', () => {
      attributesService.getNetworkAttributes();
      expect(mockGetNetworkAttributes).toBeCalled();
    });
  });

  describe('getNetworkAttributesByScope', () => {
    it('should call attributesHttp.getNetworkAttributesByScope with right props', () => {
      attributesService.getNetworkAttributesByScope('testScope');
      expect(mockGetNetworkAttributesByScope).toBeCalledWith('testScope');
    });
  });

  describe('getSystemAttributes', () => {
    it('should call attributesHttp.getSystemAttributes', () => {
      attributesService.getSystemAttributes('testScope');
      expect(mockGetSystemAttributes).toBeCalled();
    });
  });

  describe('create', () => {
    it('should call attributesHttp.create with right params', () => {
      attributesService.create();
      expect(mockCreate).toBeCalledWith(
        { message: 'testMessage' }
      );
    });
  });

  describe('update', () => {
    it('should call attributesHttp.update with right params', () => {
      attributesService.update();
      expect(mockUpdate).toBeCalledWith(
        { message: 'testMessage' }
      );
    });
  });

  describe('delete', () => {
    it('should call attributesHttp.delete with right params', () => {
      attributesService.delete();
      expect(mockDelete).toBeCalledWith(
        { message: 'testMessage' }
      );
    });
  });

  describe('getSettings', () => {
    it('should call attributesHttp.getSettings', () => {
      attributesService.getSettings();
      expect(mockGetSettings).toBeCalled();
    });
  });

  describe('updateSettings', () => {
    it('should call attributesHttp.updateSettings with right params', () => {
      attributesService.updateSettings();
      expect(mockUpdateSettings).toBeCalledWith(
        { message: 'testMessage' }
      );
    });
  });
});
