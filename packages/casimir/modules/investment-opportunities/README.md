# `@deip/investment-opportunities-module`

## Description

The module creates a special section in store, named investmentOpportunitiesStore (meaning
opportunities to get or fundraise investments for certain project and certain team), which keeps
data about all investors, investments, dates of fundraising events etc

## Usage

```
import { InvestmentOpportunitiesModule } from '@deip/investment-opportunities-module';
```
```
const testApp = new CreateApp(Vue, {
  store,
  router,
  vuetify,
  i18n
});
testApp
.addModule(InvestmentOpportunitiesModule)
```

## Dependencies

* `@deip/validation-plugin`
* `@deip/vuetify-extended`
* `@deip/env-module`
* `@deip/assets-module`
* `@deip/projects-module`
