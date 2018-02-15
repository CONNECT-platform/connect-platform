class Recipe {
  constructor(signature) {
    this.instructions = [];
    this.signature = signature || {};
  }

  add(instruction) {
    this.instructions.push(instruction);
    return this;
  }

  apply(composition) {
    composition.meta = this.signature;
    for (let instruction of this.instructions)
      instruction(composition);

    return this;
  }
}

module.exports = {
  Recipe: Recipe,
}
