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
  import VexAutocomplete from '../VexAutocomplete/VexAutocomplete';
  import { getBindableProps } from '../../composables';

  export default {
    name: 'VexPlacesAutocomplete',
    components: { VexAutocomplete },

    model: {
      prop: 'value',
      event: 'input'
    },

    props: {
      value: {
        type: String,
        default: ''
      },

      ...VexAutocomplete.props
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
          this.$emit('input', val);
        }
      },

      search: {
        get() {
          return this.lazySearch;
        },
        set(val) {
          if (!val || val === this.lazySearch) return;

          this.lazySearch = val;
          this.isLoading = true;

          this.apiService.getPlacePredictions({
            input: this.lazySearch,
            types: ['address']
          }, this.displaySuggestions);
        }
      },

      autocompleteProps() {
        return getBindableProps.call(this, VexAutocomplete.props);
      }
    },

    watch: {
      // value(val) {
      //   this.lazyLocation = val;
      // },

      // search: {
      //   handler(val) {
      //     this.isLoading = true
      //
      //     this.apiService.getPlacePredictions({
      //       input: this.location,
      //       types: ['address']
      //     }, this.displaySuggestions);
      //   }
      // }
    },

    created() {
      if (window.google.maps.places) {
        this.apiService = new window.google.maps.places.AutocompleteService();
      }
    },

    methods: {
      displaySuggestions(predictions, status) {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
          this.searchResults = [];
          return;
        }
        this.isLoading = false;
        this.searchResults = predictions.map((prediction) => prediction.description);
      }
    }
  };
</script>
