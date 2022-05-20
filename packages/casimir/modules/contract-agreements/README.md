# `@deip/contract-agreements`

## Description
The module provides infrastructure for creating different kinds of agreements between
different participants of portals/projects (it could be users, teams etc). It creates
store for managing such agreements, called `contractAgreements`.

## Usage

```
import { ContractAgreementsModule } from '@deip/contract-agreements-module ';
```
```
const testApp = new CreateApp(Vue, {
store,
router,
vuetify,
i18n
});
testApp
.addModule(ContractAgreementsModule)
```

## Dependencies

* `@deip/env-module`
* `@deip/teams-module`
* `@deip/users-module`
