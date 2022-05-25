# `@deip/auth-module`

##Description

Module does :
* set authorization on portal.
* delimit access without correct rights (auth, guestOnly)
* show messages according to localization
* create the model (`auth`) in store for authorization data
* create the store section (`currentUser`) for keeping authorization data according to model

## Usage
```
import { AuthModlue } from '@deip/auth-module';
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
.addModule(AuthModlue)
```

## Dependencies:

* `@deip/validation-plugin`,
* `@deip/vuetify-extended`,
* `@deip/env-module`,
* `@deip/users-module`
