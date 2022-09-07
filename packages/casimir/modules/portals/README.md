# `@casimir.one/portals-module`

## Description
The module creates store for two new entities called `portals` and `currentPortal`.
`Portals` entity allows to unite several portals (if there are) in one store.
`currentPortal` is the store for keeping state of certain (visited) portal. The object,
which keeps data about certain portal contents information about portal owner, admins
and also portal profile.

## Usage

```
import { PortalsModule } from '@casimir.one/portals-module';
```
```
const testApp = new CreateApp(Vue, {
store,
router,
vuetify,
i18n
});
testApp
.addModule(PortalsModule)
```

## Dependencies

* `@casimir.one/env-module`
