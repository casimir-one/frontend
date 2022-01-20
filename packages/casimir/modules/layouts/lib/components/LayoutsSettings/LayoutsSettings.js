import { defineComponent } from '@deip/platform-util';
import { formFactory } from '@deip/platform-components';

import {
  VRow,
  VCol,
  VTextField,
  VBtn,
  VIcon,
  VDivider,
  VSpacer,
  VForm
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import {
  VexAutocomplete
  // eslint-disable-next-line import/extensions,import/no-unresolved
} from '@deip/vuetify-extended';

import { VeStack } from '@deip/vue-elements';

const defaultMapKeys = () => [
  'userDetails',
  'userEdit',

  'teamDetails',
  'teamEdit',

  'projectDetails',
  'projectEdit'
];

const defaultData = () => ({
  mapping: defaultMapKeys().map((key) => ({
    key,
    value: ''
  }))
});

export default defineComponent({
  name: 'LayoutsSettings',

  mixins: [formFactory(
    'value',
    'input',
    defaultData,
    defaultData()
  )],

  computed: {
    layoutsList() {
      return this.$store.getters['layouts/list'](this.getterFilter);
    }
  },

  methods: {
    handleAddRowClick() {
      this.formData.mapping.push({ key: '', value: '' });
    },

    handleRemoveRowClick(index) {
      this.formData.mapping.splice(index, 1);
    },

    genMapFields() {
      return this.formData.mapping.map((item, index) => (
        <VRow>
          <VCol>
            <VTextField
              vModel={this.formData.mapping[index].key}
              hide-details="auto"
            />
          </VCol>
          <VCol>
            <VexAutocomplete
              vModel={this.formData.mapping[index].value}
              items={this.layoutsList}
              item-text={this.getLayoutName}
              item-value="_id"
              hide-details="auto"
              clearable
            />
          </VCol>
          <VCol class="d-flex justify-end align-center col col-1">
            <VBtn
              rounded
              small
              icon
              onClick={() => this.handleRemoveRowClick(index)}>
                <VIcon>mdi-delete</VIcon>
              </VBtn>
            </VCol>
        </VRow>
      ));
    },

    genMapAdd() {
      return (
        <VRow>
          <VCol>
            <VBtn
              outlined
              color="primary"
              small
              onClick={() => this.handleAddRowClick()}
            >Add key</VBtn>
          </VCol>
        </VRow>
      );
    },

    genFormControls() {
      return (
          <div class="d-flex">
            <VSpacer />
            <VBtn
              text
              color="primary"
              disabled={this.loading}
              onClick={() => this.$router.back()}
            >Cancel</VBtn>
            <VBtn
              color="primary"
              type="submit"
              loading={this.loading}
              disabled={this.disabled || this.loading || this.untouched}
            >Save</VBtn>
          </div>
      );
    },

    getLayoutName(item) {
      return [
        item.name,
        ...(item.isForm ? ['(form)'] : [])
      ].join(' ');
    },

    onSubmit() {
      // this.$emit('submit', this.lazyFormData);
      this.loading = true;
      this.disabled = true;

      this.$store.dispatch('layouts/updateSettings', this.lazyFormData)
        .then(() => {
          this.loading = false;
          this.disabled = false;
          this.$emit('success', this.lazyFormData);
          this.$store.dispatch('layouts/getSettings');
        })
        .catch((err) => {
          this.loading = false;
          this.disabled = false;
          this.$emit('error', err.message);
        });
    }
  },

  render() {
    return (
      <VForm onSubmit={() => this.onSubmit()}>
        <VeStack gap={32}>
          {this.genMapFields()}
          {this.genMapAdd()}
          <VDivider />
          {this.genFormControls()}
        </VeStack>

      </VForm>

    );
  }
});
