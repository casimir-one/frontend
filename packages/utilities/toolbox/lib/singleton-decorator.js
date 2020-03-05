// singleton decorator
const INSTANCE = Symbol('singleton-decorator:instance')
function getInstance (Class, ...args) {
  return Class[INSTANCE] = Class[INSTANCE] instanceof Class ? Class[INSTANCE] : new Class(...args);
}

function singleton (Class) {
  const Klass = getInstance.bind(null, Class)
  Object.defineProperty(Klass, 'instance', {
    value: Klass
  })
  return Klass
}

export { singleton }
