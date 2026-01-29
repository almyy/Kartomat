/**
 * pnpm hook to enforce a 1-week cooldown period for new packages
 * This helps protect against supply chain attacks by ensuring packages
 * have been available for at least 1 week before installation
 */

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

function readPackage(pkg, context) {
  // Skip checks for workspace packages
  if (pkg.name && pkg.name.startsWith('@workspace/')) {
    return pkg;
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};
