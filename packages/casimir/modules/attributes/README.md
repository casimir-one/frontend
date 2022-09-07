# attributes-module

The module
* creates model of attributes (named `attributesRegistry`) in the store of new portal.
* creates special section (named `attributes`) in store for keeping these created attributes
based on such a model. The entities, on which attributes could be applied are: `User`, `Team` or
`Project` so despite the module is able to work, it doesn't make sense without one (or several)
of the list:
  * `@casimir.one/users-module`
  * `@casimir.one/teams-module`
  * `@casimir.one/nft-collections-module`
* using standard defineProperty method adds attributes object to prototype of vue instance
  and creates store getters, which gets data about certain collection
  or certain item (`one`, `list`, `listByScopes`, `settings`)

## Usage
for using this module in new portal, you need to set up it in `main.js` file
```
import { AttributesModule } from '@casimir.one/attributes-module';
```
then add module to app using addModule(moduleName):
```
const testApp = new CreateApp(Vue, {
  store,
  router,
  vuetify,
  i18n
});
testApp
  .addModule(AttributesModule)
```

## Dependencies
there is a minimum set of modules, without them this module won't work:
* @casimir.one/env-module
* @casimir.one/validation-plugin
* @casimir.one/layouts-module
* @casimir.one/scopes-module
* @casimir.one/auth-module
* @casimir.one/vuetify-extended

