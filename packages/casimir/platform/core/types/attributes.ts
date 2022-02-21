import {
  Component as VueComponent,
  DefaultProps as VueComponentProps
} from 'vue/types/options';

import { ATTRIBUTE_TYPES } from '../src';
import { ServiceBasePayload } from './servisePayload';

export type AttributeTypes = typeof ATTRIBUTE_TYPES[number];

export type AttributeValueOptionCreate = {
  title: string,
  description?: string
};

export type AttributeValueOptionRead = AttributeValueOptionCreate & {
  value: string
};

export type AttributeValueTypes = 'boolean' | 'string' | 'number' | 'object' | 'array';

export type AttributeComponent = {
  component: VueComponent,
  proxyProps?: Record<string, VueComponentProps>
};

export type AttributeTypeInfo = {
  type: AttributeTypes,
  valueType: AttributeValueTypes[],

  label: string,
  icon: string,

  canBeMultiple: boolean,
  canHaveTemplate: boolean,

  components: {
    read: AttributeComponent,
    set: AttributeComponent
  }
};

export type AttributeCreateData = {
  type: AttributeTypes,
  scope: string,

  title: string,
  shortTitle: string,
  description: string,

  defaultValue: string | number | boolean | Record<string, unknown>,
  valueOptions: AttributeValueOptionCreate,

  isEditable: boolean,
  isHidden: boolean,
  isMultiple: boolean,
  isRequired: boolean,

  schemas?: {
    // change to schemas types
    read?: Array<Record<string, unknown>>,
    set?: Array<Record<string, unknown>>,
  },

  portalId: string,
};

export type AttributeUpdateData = AttributeCreateData & {
  _id: string
};

export type AttributeCreatePayload = ServiceBasePayload<AttributeCreateData>;
export type AttributeUpdatePayload = ServiceBasePayload<AttributeUpdateData>;
