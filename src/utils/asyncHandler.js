/**
 * AsyncHandler Wrapper
 * Wraps async route handlers to catch errors and forward them to error handling middleware
 * @param {Function} fn - The async function to wrap
 * @returns {Function} - Express middleware function
 */
export default (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
