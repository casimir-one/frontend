
# Scopes-module

## Description
Scope is an entity that have attributes and for which layout can be built in the Layout Builder. There are 4 scopes in Casimir: nftCollection, nftItem, user, team. Scope contains available keys (aliases) for attributes and layouts that help to access them from code easily.

## Usage
For using this module in new portal, you need to set up it in `main.js` file
```
import { ScopesModule } from '@casimir.one/scopes-module';
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
  .addModule(ScopesModule)
```

Scopes are added to `scopesRegistry` store module on the corresponding Casimir module install. Default scope configuration is located in `config` folder of a module. Additional attributes and layouts keys can be added to a scope by passing `options` parameter to `addModule` method. 

```
import { UsersModule } from '@casimir/users-module';

const usersModuleOptions = {
  attributesMappedKeys: [
    { 
      key: 'name',
      label: 'Name', 
      allowedTypes: ['text']
    },
    { 
      key: 'email', 
      label: 'Email', 
      allowedTypes: ['text']
    }
  ],
  layoutsMappedKeys: [
    {
      key: 'details', 
      label: 'User card', 
      allowedTypes: ['details']
    }
  ]
};

...

testApp.addModule(UsersModule, usersModuleOptions)
```
## Notice
there is a minimum set of modules, without them this module won't work:
* @casimir.one/env-module
* @casimir.one/validation-plugin
* @casimir.one/attributes-module
* @casimir.one/layouts-module
* @casimir.one/scopes-module
* @casimir.one/auth-module
