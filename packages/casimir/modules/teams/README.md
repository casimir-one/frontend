# `@casimir.one/teams-module`

## Description

The module creates store for two new entities called `teams` and adds new scope called `team` by action `scopesRegistry/addScope` related with `@casimir.one/scopes-module`

## Usage
```
import { TeamsModule } from '@casimir.one/teams-module';
```
then add module to app using `addModule(moduleName)` in file `main.js`:
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

* `@casimir.one/validation-plugin`
* `@casimir.one/vuetify-extended`
* `@casimir.one/env-module`
* `@casimir.one/scopes-module`
* `@casimir.one/attributes-module`
* `@casimir.one/layouts-module`
* `@casimir.one/auth-module`
* `@casimir.one/users-module`

