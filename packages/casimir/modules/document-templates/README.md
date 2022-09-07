# `@casimir.one/document-templates-module`

## Description

The module provides infrastructure for creating templates for `@casimir.one/contract-agreements-module`
It creates store section called `documentTemplates` for keeping such templates.


## Usage
```
import { DocumentTemplatesModule } from '@casimir.one/document-templates-module';
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

* `@casimir.one/validation-plugin`
* `@casimir.one/vuetify-extended`
* `@casimir.one/env-module`
