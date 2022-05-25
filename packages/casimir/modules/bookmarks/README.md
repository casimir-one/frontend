# `@deip/bookmarks-module`

## Description
The module allows marking and saving interesting projects on portal, especially when there
is a huge amount of projects. For manging bookmarks it creates store with new entity called `bookmarks`.

## Usage
```
import { BookmarksModule } from '@deip/users-module';
```
```
const testApp = new CreateApp(Vue, {
store,
router,
vuetify,
i18n
});
testApp
.addModule(BookmarksModule)
```

## Dependencies

* `@deip/env-module`
* `@deip/auth-module`
* `@deip/users-module`
