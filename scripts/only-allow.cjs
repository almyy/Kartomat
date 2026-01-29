#!/usr/bin/env node

/**
 * Script that blocks package managers other than pnpm
 * Based on the only-allow package pattern
 */

const whichPMRuns = () => {
  if (!process.env.npm_config_user_agent) {
    return undefined;
  }
  return pmFromUserAgent(process.env.npm_config_user_agent);
};

const pmFromUserAgent = (userAgent) => {
  const pmSpec = userAgent.split(' ')[0];
  const separatorPos = pmSpec.lastIndexOf('/');
  return {
    name: pmSpec.substring(0, separatorPos),
    version: pmSpec.substring(separatorPos + 1)
  };
};

const argv = process.argv.slice(2);
if (argv.length === 0) {
  console.log('Please specify the wanted package manager: only-allow <npm|pnpm|yarn>');
  process.exit(1);
}

const wantedPM = argv[0];
if (wantedPM !== 'npm' && wantedPM !== 'pnpm' && wantedPM !== 'yarn') {
  console.log(`"${wantedPM}" is not a valid package manager. Available package managers are: npm, pnpm, or yarn.`);
  process.exit(1);
}

const usedPM = whichPMRuns();

if (usedPM && usedPM.name !== wantedPM) {
  const useInstead = wantedPM === 'pnpm' 
    ? 'Use "pnpm install" instead.'
    : `Use "${wantedPM} install" instead.`;
  console.log();
  console.log(`╔═════════════════════════════════════════════════════════════╗`);
  console.log(`║                                                             ║`);
  console.log(`║   ERROR: This project requires ${wantedPM.padEnd(4)} to be used.         ║`);
  console.log(`║                                                             ║`);
  console.log(`║   You are currently using ${usedPM.name}@${usedPM.version.padEnd(10)}                 ║`);
  console.log(`║                                                             ║`);
  console.log(`║   ${useInstead.padEnd(59)} ║`);
  console.log(`║                                                             ║`);
  console.log(`╚═════════════════════════════════════════════════════════════╝`);
  console.log();
  process.exit(1);
}
