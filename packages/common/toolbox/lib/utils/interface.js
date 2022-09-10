/**
  * @param {string} interfaceName
  * @param {Object} interfaceMembers
  * @returns {Interface}
*/
export function Interface(interfaceName, interfaceMembers) {
  if (!(this instanceof Interface)) {
    return new Interface(interfaceName, interfaceMembers);
  }

  const interfaceObj = this;
  Object.keys(interfaceMembers).forEach(memberName => {
    interfaceObj[memberName] = interfaceMembers[memberName];
  });
  interfaceObj.name = interfaceName;
  return interfaceObj;
}

/**
  * @param {string} interfaceName
  * @param {string} interfaceMember
  * @param {number} argsCount
  * @throws {Error}
*/
Interface.interfaceError = function interfaceError(interfaceName, interfaceMember, argsCount) {
  const memberName = `${interfaceName}.${interfaceMember}(args: [${argsCount}])`;
  throw Error(`InterfaceError: Class does not implement interface member ${memberName}`);
};

/**
  * @param {Object} obj
  * @param {...Array.<Object>} list
  * @returns {boolean}
*/
Interface.implement = function implement(obj, ...list) {
  const interfaces = [...list];
  interfaces.forEach(_interface => {
    Object.keys(_interface).forEach(interfaceMember => {
      const isFunction = typeof _interface[interfaceMember] === 'function';

      if (isFunction && (!obj[interfaceMember] || obj[interfaceMember].length !== _interface[interfaceMember].length)) {
        Interface.interfaceError(_interface.name, interfaceMember, _interface[interfaceMember].length);
      }
    });
  });
  return true;
};