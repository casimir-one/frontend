# @deip/project-content-module

## Description

The module creates two special sections in store, named projectContent and projectContentDrafts.
projectContentDrafts keeps draft of the content until user decide to publish the content. After publishing
content stored in projectContent section.

## Usage

```
import { ProjectContentModule } from '@deip/project-content-module';
```
```
const testApp = new CreateApp(Vue, {
  store,
  router,
  vuetify,
  i18n
});
testApp
.addModule(ProjectContentModule)
```

## Dependencies

* `@deip/auth-module`
* `@deip/env-module`
* `@deip/users-module`
* `@deip/projects-module`
