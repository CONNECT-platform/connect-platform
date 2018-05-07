/**
 *
 * @func now()
 * @returns current timestamp in milli-seconds, with nano-second resolution.
 *
 */
module.exports = () => {
  let hrtime = process.hrtime();
  return hrtime[0] * 1000 + hrtime[1] / 1000000;
}
