# `@casimir/teams-module`

## Description

The module creates store for two new entities called `teams` and adds new scope
called `team` by action `scopesRegistry/addScope` related with `@casimir/scopes-module`

## Usage
```
import { TeamsModule } from '@casimir/teams-module';
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

* `@casimir/validation-plugin`
* `@casimir/vuetify-extended`
* `@casimir/env-module`
* `@casimir/scopes-module`
* `@casimir/attributes-module`
* `@casimir/layouts-module`
* `@casimir/auth-module`
* `@casimir/users-module`

