class NotFound extends Error {
  constructor(item) {
    super(`${item} not found.`);
  }
}

module.exports = {
  NotFound: NotFound,
}
