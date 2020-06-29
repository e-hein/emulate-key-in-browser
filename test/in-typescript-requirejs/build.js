// process.env.FORCE_COLOR = 2;
// process.stdout.isTTY = true;

const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs');
const { W_OK } = require('constants');
const debug = require('debug');
const log = debug('test-htmljs');
const debugPrefix = 'test-htmljs-';

const rootDir = path.join(__dirname, '../../');
const outDir = path.join(__dirname, 'dist');
clean(outDir);
shelljs.exec('tsc', { fatal: true });
copyAssets();
log('done');

function copyAssets() {
  const log = debug(debugPrefix + 'assets');
  const dest = path.join(outDir, 'assets');
  clean(dest);
  const src = path.join(rootDir, 'test/assets');
  cp(log, path.join(src, '*.png'), dest);
  cp(log, path.join(src, '*.css'), dest);
  cp(log, path.join(src, 'favicon.ico'), outDir);
  log('done');
}

function clean(dest) {
  try {
    fs.accessSync(dest, W_OK);
    log('clean up dest');
    shelljs.exec('rm -rf ' + dest);
  } catch (e) {
    log('dest is clean');
  }
  shelljs.mkdir('-p', dest);
}

function cp(log, src, dest) {
  log('copy files: ', path.basename(src));
  shelljs.cp('-r', src, dest);
}
