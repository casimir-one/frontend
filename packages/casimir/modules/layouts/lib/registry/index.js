import {
  Singleton, wrapInArray, camelCase, collectionMerge
} from '@deip/toolbox';

export class LayoutsRegistry extends Singleton {
  _componentsRegistry = {};

  _blocksRegistry = {};

  // /////////////////////////////

  registerBlocks(blocks, section) {
    const sectionKey = camelCase(section);

    for (const block of wrapInArray(blocks)) {
      this._blocksRegistry[sectionKey].blocks = collectionMerge(
        this._blocksRegistry[sectionKey].blocks,
        block,
        { key: 'name' }
      );
    }

    return this;
  }

  // /////////////////////////////

  registerBlocksSections(sections) {
    for (const section of wrapInArray(sections)) {
      const sectionKey = camelCase(section);

      if (!Object.prototype.hasOwnProperty.call(this._blocksRegistry, sectionKey)) {
        this._blocksRegistry[sectionKey] = {
          title: section,
          blocks: []
        };
      }
    }

    return this;
  }

  // /////////////////////////////

  registerBlocksObjects(objs) {
    for (const obj of wrapInArray(objs)) {
      const { title, blocks = [] } = obj;

      this
        .registerBlocksSections(title)
        .registerBlocks(blocks, title);
    }

    return this;
  }

  // /////////////////////////////

  registerComponents(components = {}) {
    for (const key of Object.keys(components)) {
      this._componentsRegistry[key] = components[key];
    }

    return this;
  }

  // /////////////////////////////

  getBlocks(section) {
    if (section) {
      const sectionKey = camelCase(section);
      return this._blocksRegistry[sectionKey];
    }
    return Object.values(this._blocksRegistry);
  }

  getComponents() {
    return this._componentsRegistry;
  }
}
