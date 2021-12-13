class BaseOperationsRegistry {
  constructor(map) {
    this.map = map;
  }

  get(cmdNum) { return this.map[cmdNum]; };
}


export default BaseOperationsRegistry;