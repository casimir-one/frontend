export const Interface = function (interfaceName, interfaceMembers) {
  if (!(this instanceof Interface)) {
    return new Interface(interfaceName, interfaceMembers);
  }

  const interfaceObj = this;
  Object.keys(interfaceMembers).forEach((memberName) => {
    interfaceObj[memberName] = interfaceMembers[memberName];
  });
  interfaceObj.name = interfaceName;
  return interfaceObj;
};

Interface.interfaceError = function (interfaceName, interfaceMember, argsCount) {
  throw Error(`InterfaceError: Class does not implement interface member ${interfaceName}.${interfaceMember}(args: [${argsCount}])`);
};

Interface.implement = function (obj, ...list) {
  const interfaces = [...list];

  interfaces.forEach((_interface) => {
    Object.keys(_interface).forEach((interfaceMember) => {
      const isFunction = typeof _interface[interfaceMember] === 'function';

      if (isFunction
          && (!obj[interfaceMember]
            || obj[interfaceMember].length !== _interface[interfaceMember].length)) {
        Interface.interfaceError(_interface.name,
          interfaceMember,
          _interface[interfaceMember].length);
      }
    });
  });

  return true;
};
