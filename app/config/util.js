class VariantProperty {
  constructor(source, values) {
    this.source = source;
    this.values = values;
  }

  valueOf() {
    return this.values[this.source()];
  }
}

module.exports = {
  variant: (source, values) => new VariantProperty(source, values),
}
