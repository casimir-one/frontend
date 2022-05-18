# `@deip/projects-module`


## Description

The module creates store for a new entity called `projects` and also adds new scope
called `projectsScope` by action `scopesRegistry/addScope` related with `@deip/scopes-module`

## Usage

```
import { ProjectsModule } from '@diep/projects-module';
```
then add module to app using `addModule(moduleName)`:
```
const testApp = new CreateApp(Vue, {
  store,
  router,
  vuetify,
  i18n
});
testApp
.addModule(ProjectsModule)
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
