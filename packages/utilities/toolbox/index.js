import dotProp from 'dot-prop';
import objectPath from 'object-path'; // switch to this from dotprop

import kindOf from 'kind-of';
import RecursiveIterator from 'recursive-iterator';
import { find as deepFind } from 'find-keypath';

export * from './lib/collections';
export * from './lib/enum';
export * from './lib/form';
export * from './lib/objects';
export * from './lib/singleton';
export * from './lib/validation';
export * from './lib/color';
export * from './lib/strings';
export * from './lib/i18n';
export * from './lib/files';
export * from './lib/interface';
export * from './lib/hash';
export * from './lib/template-string-parser';

export * from 'change-case';

export {
  dotProp,
  objectPath,

  RecursiveIterator,
  deepFind,
  kindOf
};
