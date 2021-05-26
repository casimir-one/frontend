import {
  deepFreeze,
  camelizeObjectKeys
} from '../lib/objects';

describe('deepFreeze', () => {
  it('should freeze object at all levels', () => {
    const object = {
      externalId: 1,
      publicProfile: {
        personalNo: 111
      }
    };
    const result = deepFreeze(object);
    expect(result).toBeFrozen();
    expect(result.publicProfile).toBeFrozen();
  });
});

describe('camelizeObjectKeys', () => {
  it('should return empty object', () => {
    expect(camelizeObjectKeys(null)).toEqual({});
  });

  it('should camelize object keys only on the first level', () => {
    const object = {
      external_id: 1,
      public_profile: {
        personal_no: 111
      }
    };
    const expectedResult = {
      externalId: 1,
      publicProfile: {
        personal_no: 111
      }
    };
    expect(camelizeObjectKeys(object)).toEqual(expectedResult);
  });
});
