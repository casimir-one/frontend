# `@casimir/nft-collections-module`


## Description

The module creates store for a new entity called `NFT collection` and also adds new scope
called `nftCollection` by action `scopesRegistry/addScope` related with `@casimir/scopes-module`

## Usage

```
import { NftCollectionsModule } from '@casimir/nft-collections-module';
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
* `@casimir/validation-plugin`
* `@casimir/vuetify-extended`
* `@casimir/env-module`
* `@casimir/scopes-module`
* `@casimir/attributes-module`
* `@casimir/layouts-module`
* `@casimir/auth-module`
* `@casimir/user-module`
