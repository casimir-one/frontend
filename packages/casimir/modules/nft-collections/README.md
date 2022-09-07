# `@casimir.one/nft-collections-module`


## Description

The module creates store for a new entity called `NFT collection` and also adds new scope
called `nftCollection` by action `scopesRegistry/addScope` related with `@casimir.one/scopes-module`

## Usage

```
import { NftCollectionsModule } from '@casimir.one/nft-collections-module';
```
then add module to app using `addModule(moduleName)`:
```
const testApp = new CreateApp(Vue, {
  store,
  router,
  vuetify,
  i18n
});
testApp.addModule(NftCollectionsModule)
```

## Dependencies
* `@casimir.one/validation-plugin`
* `@casimir.one/vuetify-extended`
* `@casimir.one/env-module`
* `@casimir.one/scopes-module`
* `@casimir.one/attributes-module`
* `@casimir.one/layouts-module`
* `@casimir.one/auth-module`
* `@casimir.one/user-module`
