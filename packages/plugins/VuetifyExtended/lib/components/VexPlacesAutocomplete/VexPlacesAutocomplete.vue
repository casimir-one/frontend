<template>
  <vex-autocomplete
    v-if="apiService"
    v-model="location"
    class="vex-places-autocomplete"
    :search-input.sync="search"
    :items="searchResults"
    hide-no-data
    :loading="isLoading"
    v-bind="autocompleteProps"
  />
  <div v-else>
    You need enable goole maps api
  </div>
</template>

<script>
  import { defineComponent } from '@deip/platform-util';
  import VexAutocomplete from '../VexAutocomplete/VexAutocomplete';
  import { getBindableProps } from '../../composables';

  export default defineComponent({
    name: 'VexPlacesAutocomplete',
    components: { VexAutocomplete },

    model: {
      prop: 'value',
      event: 'change'
    },

    props: {
      value: {
        type: String,
        default: ''
      },

      ...VexAutocomplete.options.props
    },

    data(vm) {
      return {
        lazyLocation: vm.value,
        lazySearch: vm.value,

        searchResults: [],
        /** @type {object | null} */
        apiService: null,
        isLoading: false
      };
    },

    computed: {
      location: {
        get() {
          return this.lazyLocation;
        },
        set(val) {
          if (val === this.lazyLocation) return;

          this.lazyLocation = val;
          this.$emit('change', val);
        }
      },

      search: {
        get() {
          return this.lazySearch;
        },
        set(val) {
          if (!val || val === this.lazySearch) return;

          this.lazySearch = val;

          this.searchLocations(this.lazySearch);
        }
      },

      autocompleteProps() {
        return getBindableProps.call(this, VexAutocomplete.options.props);
      }
    },

    created() {
      this.makeAutocompleteService();
      this.searchLocations(this.search);
    },

    methods: {
      makeAutocompleteService() {
        try {
          this.apiService = new window.google.maps.places.AutocompleteService();
        } catch (e) {
          this.apiService = null;
        }
      },

      /**
       * @param {string} val search query
       * @return {Promise<void>}
       */
      async searchLocations(val) {
        this.isLoading = true;
        try {
          const {
            predictions = []
          } = await this.apiService.getPlacePredictions({
            input: val,
            types: ['address']
          });
          this.searchResults = predictions.map((p) => p.description);
        } catch (e) {
          this.searchResults = [];
        }
        this.isLoading = false;
      }
    }
  });
</script>
