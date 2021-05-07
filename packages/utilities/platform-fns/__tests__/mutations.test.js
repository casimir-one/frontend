import {
  setListMutation,
  setListMutationFactory,
  setOneMutation,
  setOneMutationFactory,
  removeFromListMutation,
  removeFromListMutationFactory
} from '../lib/store';

describe('setListMutation', () => {
  it('should add object', () => {
    const state = {
      data: [{
        id: 1,
        externalId: 'a'
      }]
    };
    const expectedState = {
      data: [{
        id: 1,
        externalId: 'a'
      }, {
        id: 2,
        externalId: 'b'
      }]
    };

    setListMutation(state, [{ id: 2, externalId: 'b' }]);
    expect(state).toEqual(expectedState);
  });

  it('should merge objects', () => {
    const state = {
      data: [{
        id: 1,
        externalId: 'a'
      }]
    };
    const expectedState = {
      data: [{
        id: 9,
        externalId: 'a'
      }]
    };

    setListMutation(state, [{ id: 9, externalId: 'a' }]);
    expect(state).toEqual(expectedState);
  });

  it('should  not change state when payload is empty', () => {
    const state = {
      data: []
    };

    setListMutation(state, null);
    expect(state).toEqual({ data: [] });
  });
});

describe('setListMutationFactory', () => {
  const options = { storeKey: 'objects', mergeKey: 'id' };

  it('should add object', () => {
    const state = {
      objects: [{
        id: 1,
        externalId: 'a'
      }]
    };
    const expectedState = {
      objects: [{
        id: 1,
        externalId: 'a'
      }, {
        id: 2,
        externalId: 'b'
      }]
    };

    setListMutationFactory(options)(state, [{ id: 2, externalId: 'b' }]);
    expect(state).toEqual(expectedState);
  });

  it('should merge objects', () => {
    const state = {
      objects: [{
        id: 1,
        externalId: 'a'
      }]
    };
    const expectedState = {
      objects: [{
        id: 1,
        externalId: 'z'
      }]
    };

    setListMutationFactory(options)(state, [{ id: 1, externalId: 'z' }]);
    expect(state).toEqual(expectedState);
  });
});

describe('setOneMutation', () => {
  it('should add object', () => {
    const state = {
      data: [{
        id: 1,
        externalId: 'a'
      }]
    };
    const expectedState = {
      data: [{
        id: 1,
        externalId: 'a'
      }, {
        id: 2,
        externalId: 'b'
      }]
    };

    setOneMutation(state, { id: 2, externalId: 'b' });
    expect(state).toEqual(expectedState);
  });

  it('should merge objects', () => {
    const state = {
      data: [{
        id: 1,
        externalId: 'a'
      }]
    };
    const expectedState = {
      data: [{
        id: 9,
        externalId: 'a'
      }]
    };

    setOneMutation(state, { id: 9, externalId: 'a' });
    expect(state).toEqual(expectedState);
  });

  it('should not change state when payload is empty', () => {
    const state = {
      data: []
    };

    setOneMutation(state, null);
    expect(state).toEqual({ data: [] });
  });
});

describe('setOneMutationFactory', () => {
  const options = { storeKey: 'objects', mergeKey: 'id' };

  it('should add object', () => {
    const state = {
      objects: [{
        id: 1,
        externalId: 'a'
      }]
    };
    const expectedState = {
      objects: [{
        id: 1,
        externalId: 'a'
      }, {
        id: 2,
        externalId: 'b'
      }]
    };

    setOneMutationFactory(options)(state, { id: 2, externalId: 'b' });
    expect(state).toEqual(expectedState);
  });

  it('should merge objects', () => {
    const state = {
      objects: [{
        id: 1,
        externalId: 'a'
      }]
    };
    const expectedState = {
      objects: [{
        id: 1,
        externalId: 'z'
      }]
    };

    setOneMutationFactory(options)(state, { id: 1, externalId: 'z' });
    expect(state).toEqual(expectedState);
  });
});

describe('removeFromListMutation', () => {
  it('should remove object', () => {
    const state = {
      data: [{
        id: 1,
        externalId: 'a'
      },
      {
        id: 2,
        externalId: 'b'
      }]
    };
    const expectedState = {
      data: [{
        id: 1,
        externalId: 'a'
      }]
    };

    removeFromListMutation(state, 'b');
    expect(state).toEqual(expectedState);
  });

  it('should not change state if object wasn\'t found', () => {
    const state = {
      data: []
    };

    removeFromListMutation(state, 'a');
    expect(state).toEqual({ data: [] });
  });
});

describe('removeFromListMutationFactory', () => {
  const options = { storeKey: 'objects', mergeKey: 'id' };

  it('should remove object', () => {
    const state = {
      objects: [{
        id: 1,
        externalId: 'a'
      }]
    };
    const expectedState = {
      objects: [{
        id: 1,
        externalId: 'a'
      }]
    };

    removeFromListMutationFactory(options)(state, 2);
    expect(state).toEqual(expectedState);
  });

  it('should not change state if object wasn\'t found', () => {
    const state = {
      objects: []
    };

    removeFromListMutationFactory(options)(state, 'a');
    expect(state).toEqual({ objects: [] });
  });

  it('should throw error', () => {
    const state = {
      data: [{
        id: 1,
        externalId: 'a'
      }]
    };

    expect(() => {
      removeFromListMutationFactory(options)(state, 'a');
    }).toThrow();
  });
});
