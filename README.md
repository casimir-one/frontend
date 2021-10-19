# Casimir

**Casimir** — is a low-code constructor (framework) for building Portals in the DEIP ecosystem.
With Casimir, you can quickly build a front-end application to connect to the server-side of the DEIP infrastructure. The modular structure formed the basis of Casimir’s development. This implementation allows connecting to the portal only required functionality without redundant code. 

The DEIP Modules repository consists of 2 main areas:
* Common — a set of self-sufficient and independent packages, utilities, plugins, components that can be used outside the Casimir ecosystem
* Casimir — a low-code constructor for building Portals in the DEIP ecosystem

Casimir, in turn, consists of several types of entities:
* platform — a set of self-sufficient and independent utilities and components that can be used in different areas of the low-code constructor
* models — data transfer models and format packages
* services — Data Service Packages. Currently, only the rest-API transmission option is available
* modules — functional modules of Casimir. Use modules for bringing to the application everything necessary for the full usage of certain functionality


## Create Portal
The DEIP-modules repository consists of Java Script packages designed to build front-end applications and Portals. Modules allow you to connect to services to interact with DEIP infrastructure and are implemented using the Vue framework and Vuetify components library. 

```
# install vue services global
npm install -g @vue/cli

# create our project
vue create deip-app

# navigate to the new project directory
cd deip-app
```

Add needed Casimir modules: 
* [vuetify](https://vuetifyjs.com/en/getting-started/installation/) - is an UI framework built on top of Vue.js
* [vue-i18n](https://kazupon.github.io/vue-i18n/) - is internationalization plugin for Vue.js
* [vuex](https://vuex.vuejs.org/) - is a data storage for Vue.js applications
* [router](https://router.vuejs.org/) - is an application navigation
```
npm install -S vuetify vue-i18n vuex vue-router
```
* @deip/env-module — is a module of environment variables and transport instance libraries
* @deip/attributes-module — is a module of entities attributes (e.g. to add the user’s avatar)
* @deip/layouts-module — is a layout module for the application
* @deip/auth-module — is an authentication and access rights module
* @deip/users-module — is an user module
* @deip—- additional utilities.

```
npm install -S @deip/env-module @deip/attributes-module @deip/layouts-module @deip/auth-module @deip/users-module
```

Edit the main file of the application:

```
import Vue from 'vue';
import { CreateApp } from '@deip/platform-util'; // the class, needed to prepare the application
import { EnvModule } from '@deip/env-module';
import { AttributesModule } from '@deip/attributes-module';
import { LayoutsModule } from '@deip/layouts-module';
import { AuthModule } from '@deip/auth-module';
import { UsersModule } from '@deip/users-module';

import App from './App';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import i18n from './plugins/i18n';

const deipApp = new CreateApp(Vue); // create new container

deipApp
  // setup environment - used in most modules
 
.addModule(EnvModule, {
    proxydi: { // store instances
      vuetifyInstance: vuetify,
      routerInstance: router,
      storeInstance: store,
      i18nInstance: i18n
    }
  })

  // register DEIP modules - used as dependency in DEIP/VEDAI modules
  .addModule(AuthModule)
  .addModule(UsersModule)
  .addModule(AttributesModule)
  .addModule(LayoutsModule)

  // resolve and install all modules
  .bootstrap()

  // create application
  .then(() => {
    // setup locales
    if (Vue.$env.VUE_APP_I18N_LOCALE) {
      i18n.locale = Vue.$env.VUE_APP_I18N_LOCALE;
    }
    if (Vue.$env.VUE_APP_I18N_FALLBACK_LOCALE) {
      i18n.fallbackLocale = Vue.$env.VUE_APP_I18N_FALLBACK_LOCALE;
    }

    const app = new Vue({
      router,
      store,
      vuetify,
      i18n,
      render: (h) => h(App)
    });

    app.$mount('#app');

    console.info('complete');
  });
```

Following this instruction, you can build an application with the specified functionality.  
Explore another example of a Casimir-based application by the [link](https://youtu.be/C5VwmWefSbI). 

## DEIP-Modules

DEIP Modules is a monorepository implemented based on [Lerna](https://github.com/lerna/lerna) with many npm packages used as a building material for the portal. The repository already contains all the necessary tools for development. Install some modules globally, if you want to manage some processes more subtly.

```
npm install -g npm-check-updates lerna
```

### Prepare repository for work

Run the following two commands to prepare the repository for work.

Install core modules and dependencies:

```
npm install
```

Install modules for repository packages and link internal dependencies:

```
npm run bootstrap
```

### Work with repository

#### Testing 

Vue application created for module development and testing. It does not contain a business model and is used exclusively for development.

```
npm run start
```

#### Add new npm-package

Check [docs](https://github.com/lerna/lerna) for all commands.

Add module 
```
lerna create new-cool-module casimir/modules
```

Add dependencies
```
lerna add lodash --scope=new-cool-module
```

#### Build

Work in progress

#### Lint\Test

```
npm run test
npm run lint
```


#### Publish

npm register keeps stable versions of modules to install them with the command `npm install -S module-name`.

#### Additional information

The DEIP-Modules repository uses the [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) agreement.
Strongly recommend making changes in one commit that will specify the type of change and scope to which the changes apply. 

```
feat(@deip/auth-module): add translation support
fix(@deip/vue-elements): wrong gutter property
...etc
```

Development and modification takes place in separate branches with naming according to type of change (see [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)):
- fix/*
- feat/*
- docs/*
- ...etc

Pre-commit hooks are used to verify the code. If your code fails the eslint check, you will not be able to commit your changes.

## Future improvements
* Increase the number of modules to fully cover platform functionality
* Create a detailed documentation on the use of Casimir and its API
* Create an online no-code mode Constructor
* Create use-cases and examples for a better understanding of Casimir and its assumptions 


