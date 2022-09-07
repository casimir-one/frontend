# `@casimir.one/users-module`

## Description

The module creates store for a new entity called `users` and also adds new scope
called `usersScope` by action `scopesRegistry/addScope` related with `@casimir.one/scopes-module`
The module also adds (if there are any) special user's attributes as a model to `attributeRegistry`

## Usage
```
import { UsersModule } from '@casimir.one/users-module';
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
.addModule(UsersModule)
```

## Dependencies

* `@casimir.one/validation-plugin`
* `@casimir.one/vuetify-extended`
* `@casimir.one/env-module`
* `@casimir.one/scopes-module`
* `@casimir.one/attributes-module`
* `@casimir.one/layouts-module`
* `@casimir.one/auth-module`
