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
  import { defineComponent } from '@casimir.one/platform-util';
  import VexAutocomplete from '../VexAutocomplete/VexAutocomplete';
  import { getBindableProps } from '../../composables';

  const placeTypesMap = {
    city: '(cities)',
    address: 'address'
  };
  /**
   * Component for changing location and specifying an address
   * uses google maps api
   */
  export default defineComponent({
    name: 'VexPlacesAutocomplete',
    components: { VexAutocomplete },

    model: {
      prop: 'value',
      event: 'change'
    },

    props: {
      /** Name of place */
      value: {
        type: String,
        default: ''
      },
      /** Location type
        * @values city, address
        */
      placeType: {
        type: String,
        default: 'city',
        validator(value) {
          return ['city', 'address'].includes(value);
        }
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
          /**
           * Change event
           * @property {string} val input text
           */
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
      /** Create new instance of google maps api service */
      makeAutocompleteService() {
        try {
          this.apiService = new window.google.maps.places.AutocompleteService();
        } catch (e) {
          this.apiService = null;
        }
      },

      /**
       * Search for a place by query
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
            types: [placeTypesMap[this.placeType]]
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
