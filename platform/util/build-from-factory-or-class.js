module.exports = factoryOrClass => {
  if (factoryOrClass.toString().startsWith('class'))
    return new factoryOrClass();
  else
    return factoryOrClass();
}
