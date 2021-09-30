<template>
  <div>
    <template v-if="apiService">
      <vex-autocomplete
        v-model="location"
        :search-input.sync="search"
        :items="searchResults"
        hide-no-data
        :loading="isLoading"
        v-bind="autocompleteProps"
      />
    </template>
    <template v-else>
      You need enable goole maps api
    </template>
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
      if (window.google.maps.places) {
        this.apiService = new window.google.maps.places.AutocompleteService();

        this.searchLocations(this.search);
      }
    },

    methods: {
      searchLocations(val) {
        this.isLoading = true;

        this.apiService.getPlacePredictions({
          input: val,
          types: ['address']
        }, this.displaySuggestions);
      },
      displaySuggestions(predictions, status) {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
          this.searchResults = [];
          return;
        }
        this.isLoading = false;
        this.searchResults = predictions.map((prediction) => prediction.description);
      }
    }
  });
</script>
