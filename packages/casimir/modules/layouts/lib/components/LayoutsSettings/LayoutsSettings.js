import {
  VRow,
  VCol,
  VBtn,
  VDivider,
  VSpacer,
  VForm,
  VSelect
  // eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { defineComponent } from '@deip/platform-util';
import { formMixin } from '@deip/platform-components';

import { VeStack } from '@deip/vue-elements';
import { collectionMerge } from '@deip/toolbox';

export default defineComponent({
  name: 'LayoutsSettings',

  mixins: [formMixin],

  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    scopes() {
      return this.$store.getters['scopesRegistry/list']();
    },

    layouts() {
      return this.$store.getters['layouts/list']();
    }
  },

  methods: {
    genSelector(selector, scopeType) {
      const keyName = `${scopeType}.${selector.key}`;
      return (
        <VCol cols="6">
          <VSelect
            value={this.getMapValue(keyName)}
            label={selector.label}
            items={this.getSelectorList(scopeType, selector.allowedTypes)}
            hint={`key: ${keyName}`}
            persistent-hint
            onChange={(val) => { this.setMapValue(keyName, val); }}
          />
        </VCol>
      );
    },

    genScope(scope) {
      const list = scope.mappedKeys.layouts
        .map((key) => this.genSelector(key, scope.type));

      return (
        <VeStack gap={24}>
          <div class="text-h5">
            {scope.label}
          </div>

          <VRow>
            {list}
          </VRow>
        </VeStack>
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

    // /////////////////////

    getSelectorList(scope, types) {
      return this.layouts
        .filter((layout) => layout.scope === scope && types.includes(layout.type))
        .map((layout) => ({
          text: layout.name,
          value: layout._id
        }));
    },

    getSelectorIcon(id) {
      const attr = this.attributes.find((a) => a._id === id);
      return this.$store.getters['attributesRegistry/one'](attr.type).icon;
    },

    getMapValue(elementKey) {
      const { mappedKeys = [] } = this.formData;
      return mappedKeys.find((el) => el.key === elementKey)?.value || '';
    },

    setMapValue(key, value) {
      const mappedKeys = collectionMerge(
        this.formData.mappedKeys || [],
        { key, value },
        { key: 'key' }
      );

      this.$set(this.formData, 'mappedKeys', mappedKeys);
    },

    // /////////////////////

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
    const list = this.scopes.map((scope) => this.genScope(scope));

    return (
      <VForm onSubmit={() => this.onSubmit()}>
        <VeStack gap={32}>
          {list}
          <VDivider />
          {this.genFormControls()}
        </VeStack>
      </VForm>
    );
  }
});
