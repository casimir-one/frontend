# `@casimir/document-templates-module`

## Description

The module provides infrastructure for creating templates for `@casimir/contract-agreements-module`
It creates store section called `documentTemplates` for keeping such templates.


## Usage
```
import { DocumentTemplatesModule } from '@casimir/document-templates-module';
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

* `@casimir/validation-plugin`
* `@casimir/vuetify-extended`
* `@casimir/env-module`
