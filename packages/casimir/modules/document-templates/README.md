# `@deip/document-templates-module`

## Description

The module provides infrastructure for creating templates for `@deip/contract-agreements-module`
It creates store section called `documentTemplates` for keeping such templates.


## Usage
```
import { DocumentTemplatesModule } from '@deip/document-templates-module';
```
```
const testApp = new CreateApp(Vue, {
store,
router,
vuetify,
i18n
});
testApp
.addModule(DocumentTemplatesModule)
```

## Dependencies

* `@deip/validation-plugin`
* `@deip/vuetify-extended`
* `@deip/env-module`
