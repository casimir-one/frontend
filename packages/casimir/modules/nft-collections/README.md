# `@casimir/nft-collections-module`


## Description

The module creates store for a new entity called `NFT collection` and also adds new scope
called `nftCollection` by action `scopesRegistry/addScope` related with `@deip/scopes-module`

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
* `@deip/validation-plugin`
* `@deip/vuetify-extended`
* `@deip/env-module`
* `@deip/scopes-module`
* `@deip/attributes-module`
* `@deip/layouts-module`
* `@deip/auth-module`
* `@deip/user-module`
