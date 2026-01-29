/**
 * pnpm hook file for custom package resolution logic
 * Currently minimal - the 1-week security cooldown is enforced
 * via the 'before' setting in .npmrc, not in this file
 */

function readPackage(pkg, context) {
  // Future custom logic can be added here
  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};
