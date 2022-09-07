# `@casimir.one/assets-module`

## Description

The module creates store for two entities: assets and balances. `Assets` shows which assets with which exact parameters
were issued. It's kinda description of company's 'bonds' emission in corporate terminology.
`Balances` shows who and which quantity owns such 'bonds' (in our case nft).

[//]: # (TODO: As for real currencies which also may be the assets of this module - they should be described if the ability of their using will still make sense.)

## Usage

```
import { AssetsModule } from '@casimir.one/assets-module';
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
.addModule(AssetsModule)
```

## Dependencies

* `@casimir.one/env-module`
* `@casimir.one/validation-plugin`
* `@casimir.one/vuetify-extended`
* `@casimir.one/auth-module`
* `@casimir.one/users-module`
* `@casimir.one/teams-module`

## Context modules

Despite layouts-module are able to work without below list of modules, they are necessary for
portal in general:

* `@casimir.one/scopes-module`
* `@casimir.one/users-module` or/and` @casimir.one/teams-module` or/and `@casimir.one/nft-collections-module`
