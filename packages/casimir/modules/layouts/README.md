# `@casimir.one/layouts-module`

## Description

The module allows managing layouts on portal. It creates model of layouts in the
store of new portal. It also creates special section in store for keeping these
created layouts based on such a model.


## Usage
```
import { LayoutsModule } from '@casimir.one/layouts-module';
```
then add module to app using `addModule(moduleName)`:
```
const testApp = new CreateApp(Vue, {
  store,
  router,
  vuetify,
  i18n
});
testApp
.addModule(LayoutsModule)
```

## Dependencies
* `@casimir.one/env-module`

## Context modules

Despite layouts-module are able to work without below list of modules, they are necessary for
portal in general:

* `@casimir.one/validation-plugin`
* `@casimir.one/attributes-module`
* `@casimir.one/scopes-module`
* `@casimir.one/auth-module`
* `@casimir.one/users-module` or/and` @casimir.one/teams-module` or/and `@casimir.one/nft-collections-module`
