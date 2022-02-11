import Vue from 'vue';
import Vuex from 'vuex';
import { layoutStore } from '@/store/layoutStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    layout: layoutStore
  }
});
