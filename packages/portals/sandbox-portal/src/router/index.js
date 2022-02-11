import Vue from 'vue';
import VueRouter from 'vue-router';
import qs from 'qs';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: {
      name: 'projects'
    }
  }
];

const router = new VueRouter({
  routes,

  parseQuery(query) {
    return qs.parse(query);
  },

  stringifyQuery(query) {
    const result = qs.stringify(query);

    return result ? (`?${result}`) : '';
  }
});

router.beforeResolve((to, from, next) => {
  const { viewSetup: { appBar, sideBar } = {} } = to.meta;

  if (appBar) {
    store.dispatch('layout/changeAppBarState', appBar);
  } else {
    store.dispatch('layout/resetAppBarState');
  }

  if (sideBar) {
    store.dispatch('layout/changeSideBarState', sideBar);
  } else {
    store.dispatch('layout/resetSideBarState');
  }

  next();
});

export default router;
