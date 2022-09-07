# @casimir.one/nft-items-module

## Description

The module creates two special sections in store, named nftItems and nftItemDrafts.
nftItemDrafts keeps draft of the content until user decide to publish the content. After publishing
content stored in nftItems section.

## Usage

```
import { NftItemsModule } from '@casimir.one/nft-items-module';
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

* `@casimir.one/auth-module`
* `@casimir.one/env-module`
* `@casimir.one/users-module`
* `@casimir.one/nft-collections-module`
