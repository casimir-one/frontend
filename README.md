# DEIP Modules

We use [Lerna](https://github.com/lerna/lerna) for managing our packages.

### Prepare repo for work

It is highly recommended to install lerna globally

```
npm install -g lerna
```

```
npm install && npm run bootstrap
```

### Basic: Add module (internal/external)

Check [docs](https://github.com/lerna/lerna) for all commands.

for all packages
```
lerna add [module name]
```

specified package
```
lerna add [module name] --scope=[target]
```

### Publish

Publish allowed only from develop, master branches. Brunch must be clean and up to date.

```
npm run publish
```
