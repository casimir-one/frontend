import {
  VTextField,
  VRow,
  VCol,
  VIcon,
  VBtn
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { VeStack } from '@deip/vue-elements';
import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin, AttributeMultipleModelMixin } from '../../mixins';

const defaultUrlModel = () => ({ url: '', label: '' });

export const AttributeUrlSet = defineComponent({
  name: 'AttributeUrlSet',

  mixins: [AttributeSetMixin, AttributeMultipleModelMixin],

  data() {
    return {
      lazyValue: this.isMultiple ? [] : {}
    };
  },

  mounted() {
    this.addInitialValueItem(defaultUrlModel());
  },

  methods: {
    genUrlField(
      errors,
      target = this.internalValue,
      label = this.attributeInfo.title,
      hideDetails = false
    ) {
      return (
        <VTextField
          vModel={target.url}
          label={label}
          prepend-inner-icon="mdi-earth"
          errorMessages={errors}
          hideDetails={hideDetails}
          class="rounded-br-0 rounded-tr-0"
        />
      );
    },

    genLabelField(
      target = this.internalValue,
      label = 'Link',
    ) {
      return (
        <VTextField
          vModel={target.label}
          label={label}
          hide-details
          class="rounded-bl-0 rounded-tl-0"
        />
      );
    },

    genSingleAttribute(errors) {
      return (
        <VRow noGutters>
          <VCol style="margin-right: -1px;">
            {this.genUrlField(errors)}
          </VCol>
          <VCol>
            {this.genLabelField()}
          </VCol>
        </VRow>
      );
    },

    genMultipleAttribute(errors) {
      const addBtn = () => (
        <VBtn
          outlined
          small
          color="primary"
          onClick={() => { this.addValueItem(defaultUrlModel()); }}
        >
          Add URL
        </VBtn>
      );

      const items = () => this.internalValue
        .map((_, index) => {
          const delBtn = () => (
            <VBtn
              icon small class="my-1"
              disabled={index === 0}
              onClick={() => { this.removeValueItem(index); }}
            >
              <VIcon>mdi-close</VIcon>
            </VBtn>
          );

          return (
            <VRow noGutters>
              <VCol style="margin-right: -1px;">
                {this.genUrlField([], this.internalValue[index], 'url', true)}
              </VCol>
              <VCol>
                {this.genLabelField(this.internalValue[index])}
              </VCol>
              <VCol cols="auto">{delBtn()}</VCol>
            </VRow>
          );
        });

      return (
        <VeStack>
          <div class="text-subtitle-1">{this.attributeInfo.title}</div>
          {items()}
          {this.genErrors(errors)}
          <div>{addBtn()}</div>
        </VeStack>
      );
    },

    genAttribute(errors) {
      return this.attributeInfo.isMultiple
        ? this.genMultipleAttribute(errors)
        : this.genSingleAttribute(errors);
    }
  }
});
