/**
 *
 *
 * @module platform/core/base
 * @version 0.1.3
 *
 * @description
 * the basic conecpts of the core of the platform. <br><br>
 * exports the following objects: <br>
 * <ul>
 * <li> [errors]{@link module:platform/core/base/errors}<br>
 *      the errors occuring at this execution level </li>
 * <li> [pin]{@link module:platform/core/base/pin}<br>
 *      the abstract definition of pins </li>
 * <li> [io]{@link module:platform/core/base/io}<br>
 *      the definition of input and output pins </li>
 * <li> [control]{@link module:platform/core/base/control}<br>
 *      the definition of control pins </li>
 * <li> [node]{@link module:platform/core/base/node}<br>
 *      the definition of nodes </li>
 * </ul>
 *
 */
module.exports = {
  errors: require('./errors'),
  pin: require('./pin'),
  io: require('./io'),
  control: require('./control'),
  node: require('./node'),
}
