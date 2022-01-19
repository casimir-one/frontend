import { getPackages } from './composables/getPackages';
import { buildPackageLib } from './composables/buildPackageLib';

for (const pkgPath of getPackages()) {
  buildPackageLib(pkgPath);
}
