class Recipe {
  constructor() {
    this.instructions = [];
  }

  add(instruction) {
    this.instructions.push(instruction);
    return this;
  }

  remove(instruction) {
    this.instructions.remove(instruction);
    return this;
  }

  apply(composition) {
    for (let instruction of this.instructions)
      instruction(composition);

    return this;
  }
}

module.exports = {
  Recipe: Recipe,
}
