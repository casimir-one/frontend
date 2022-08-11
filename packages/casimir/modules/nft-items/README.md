# @casimir/nft-items-module

## Description

The module creates two special sections in store, named nftItems and nftItemDrafts.
nftItemDrafts keeps draft of the content until user decide to publish the content. After publishing
content stored in nftItems section.

## Usage

```
import { NftItemsModule } from '@casimir/nft-items-module';
```
```
const testApp = new CreateApp(Vue, {
  store,
  router,
  vuetify,
  i18n
});
testApp
.addModule(NftItemsModule)
```

## Dependencies

* `@casimir/auth-module`
* `@casimir/env-module`
* `@casimir/users-module`
* `@casimir/nft-collections-module`
