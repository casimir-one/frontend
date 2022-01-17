const { getPackages } = require('./composables/getPackages');
const { buildPackageLib } = require('./composables/buildPackageLib');

for (const pkgPath of getPackages()) {
  buildPackageLib(pkgPath);
}
