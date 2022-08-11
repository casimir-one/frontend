import { pascalCase } from '@casimir/toolbox';

/**
 * Generate component name by this.viewType
 * @returns {string} component name
 */
export function componentViewType() {
  const defaultView = `${this.$options.name}${pascalCase(this.defaultViewType || 'default')}`;
  if (this.viewType) {
    const requestedView = `${this.$options.name}${pascalCase(this.viewType)}`;
    const requestedViewExist = Object.keys(this.$options.components)
      .includes(requestedView);
    return requestedViewExist ? requestedView : defaultView;
  }
  return defaultView;
}
