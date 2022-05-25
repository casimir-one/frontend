import { proxydi } from '@deip/proxydi';
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
      jest.spyOn(proxydi, 'get').mockReturnValue({});
      attributesService.create();

      expect(mockCreate).toBeCalledWith(
        { message: 'testMessage' }
      );
    });

    it('should not call attributesHttp.create and return message', async () => {
      jest.spyOn(proxydi, 'get').mockReturnValue({
        RETURN_MSG: true
      });

      expect(await attributesService.create()).toEqual({ message: 'testMessage' });
      expect(mockCreate).not.toBeCalled();
    });
  });

  describe('update', () => {
    it('should call attributesHttp.update with right params', () => {
      jest.spyOn(proxydi, 'get').mockReturnValue({});
      attributesService.update();

      expect(mockUpdate).toBeCalledWith(
        { message: 'testMessage' }
      );
    });

    it('should not call attributesHttp.update and return message', async () => {
      jest.spyOn(proxydi, 'get').mockReturnValue({ RETURN_MSG: true });

      expect(await attributesService.update()).toEqual({ message: 'testMessage' });
      expect(mockUpdate).not.toBeCalled();
    });
  });

  describe('delete', () => {
    it('should call attributesHttp.delete with right params', () => {
      jest.spyOn(proxydi, 'get').mockReturnValue({});
      attributesService.delete();

      expect(mockDelete).toBeCalledWith(
        { message: 'testMessage' }
      );
    });

    it('should not call attributesHttp.delete and return message', async () => {
      jest.spyOn(proxydi, 'get').mockReturnValue({ RETURN_MSG: true });

      expect(await attributesService.delete()).toEqual({ message: 'testMessage' });
      expect(mockDelete).not.toBeCalled();
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
      jest.spyOn(proxydi, 'get').mockReturnValue({});
      attributesService.updateSettings();

      expect(mockUpdateSettings).toBeCalledWith(
        { message: 'testMessage' }
      );
    });

    it('should not call attributesHttp.updateSettings and return message', async () => {
      jest.spyOn(proxydi, 'get').mockReturnValue({ RETURN_MSG: true });

      expect(await attributesService.updateSettings()).toEqual({ message: 'testMessage' });
      expect(mockUpdateSettings).not.toBeCalled();
    });
  });
});
