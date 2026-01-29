#!/usr/bin/env node

/**
 * Script to update the 'before' date in .npmrc to enforce a 1-week cooldown
 * for new packages. This provides security against supply chain attacks.
 */

const fs = require('fs');
const path = require('path');

const NPMRC_PATH = path.join(__dirname, '.npmrc');
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

try {
  // Calculate date from 1 week ago
  const oneWeekAgo = new Date(Date.now() - ONE_WEEK_MS);
  const beforeDate = oneWeekAgo.toISOString();

  // Read current .npmrc
  let npmrcContent = fs.readFileSync(NPMRC_PATH, 'utf8');

  // Update the before date
  const beforeRegex = /before=[\d-:.TZ]+/;
  if (beforeRegex.test(npmrcContent)) {
    npmrcContent = npmrcContent.replace(beforeRegex, `before=${beforeDate}`);
  } else {
    // Add before date if it doesn't exist
    npmrcContent += `\nbefore=${beforeDate}\n`;
  }

  // Write back to .npmrc
  fs.writeFileSync(NPMRC_PATH, npmrcContent, 'utf8');
  
  console.log(`✓ Updated .npmrc with before date: ${beforeDate}`);
  console.log('  Only packages published before this date will be installed.');
} catch (error) {
  console.error('Failed to update .npmrc:', error.message);
  // Don't fail the install if this script fails
  process.exit(0);
}
