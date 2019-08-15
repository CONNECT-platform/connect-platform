const block = () => Math.random().toString(36).substring(2);

module.exports = () => {
  return 'u' + block() + ':' + block() + block();
}
