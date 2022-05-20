# `@deip/teams-module`

## Description

The module creates store for two new entities called `teams` and adds new scope
called `teamScope` by action `scopesRegistry/addScope` related with `@deip/scopes-module`

## Usage

then add module to app using `addModule(moduleName)` in file `main.js`:

```
import { TeamsModule } from '@deip/teams-module';
```
```
const testApp = new CreateApp(Vue, {
  store,
  router,
  vuetify,
  i18n
});
testApp
.addModule(TeamsModule)
```

## Dependencies

* `@deip/validation-plugin`
* `@deip/vuetify-extended`
* `@deip/env-module`
* `@deip/scopes-module`
* `@deip/attributes-module`
* `@deip/layouts-module`
* `@deip/auth-module`
* `@deip/users-module`

