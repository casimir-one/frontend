# `@deip/users-module`

## Description

The module creates store for a new entity called `users` and also adds new scope
called `usersScope` by action `scopesRegistry/addScope` related with `@deip/scopes-module`
The module also adds (if there are any) special user's attributes as a model to `attributeRegistry`

## Usage
```
import { UsersModule } from '@deip/users-module';
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

* `@deip/validation-plugin`
* `@deip/vuetify-extended`
* `@deip/env-module`
* `@deip/scopes-module`
* `@deip/attributes-module`
* `@deip/layouts-module`
* `@deip/auth-module`
