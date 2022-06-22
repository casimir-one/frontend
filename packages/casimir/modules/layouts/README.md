# `@deip/layouts-module`

## Description

The module allows managing layouts on portal. It creates model of layouts in the
store of new portal. It also creates special section in store for keeping these
created layouts based on such a model.


## Usage
```
import { LayoutsModule } from '@deip/layouts-module';
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
* `@deip/env-module`

## Context modules

Despite layouts-module are able to work without below list of modules, they are necessary for
portal in general:

* `@deip/validation-plugin`
* `@deip/attributes-module`
* `@casimir/scopes-module`
* `@deip/auth-module`
* `@deip/users-module` or/and` @deip/teams-module` or/and `@casimir/nft-collections-module`
