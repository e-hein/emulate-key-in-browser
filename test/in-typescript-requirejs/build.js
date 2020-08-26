// process.env.FORCE_COLOR = 2;
// process.stdout.isTTY = true;

const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs');
const { W_OK } = require('constants');
const debug = require('debug');
const log = debug('test-htmljs');
const logWww = debug('test-htmljs:www');
const debugPrefix = 'test-htmljs-';

const rootDir = path.join(__dirname, '../../');
const outDir = path.join(__dirname, 'dist');
const wwwDir = path.join(__dirname, 'www');
const srcDir = path.join(__dirname, 'src');

clean(outDir);
shelljs.exec('tsc', { fatal: true });
copyAssets();
assembleWww();
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

function assembleWww() {
  logWww('assemble wwww: ' + wwwDir);
  const scriptsDir = path.join(wwwDir, 'scripts');
  const stylesDir = path.join(wwwDir, 'styles');
  shelljs.exec('rm -rf www');
  shelljs.exec('mkdir -p ' + scriptsDir);
  shelljs.exec('mkdir -p ' + stylesDir);
  cp(logWww, path.join(outDir, '*.js'), scriptsDir);
  shelljs.exec('rm ' + path.join(scriptsDir, '*.spec.js'));
  cp(logWww, path.join(outDir, '*.js.map'), scriptsDir);
  shelljs.exec('rm ' + path.join(scriptsDir, '*.spec.js.map'));
  cp(logWww, path.join(outDir, 'favicon.ico'), wwwDir);
  cp(logWww, require.resolve('requirejs/require.js'), scriptsDir);
  cp(logWww, path.join(outDir, 'assets'), wwwDir);
  cp(logWww, path.join(srcDir, '*.html'), wwwDir);
  cp(logWww, path.join(srcDir, '*.css'), stylesDir);
  cp(logWww, require.resolve('emulate-key-in-browser/dist/bundles/emulate-key-in-browser.amd.js'), path.join(wwwDir, 'emulate-key-in-browser.js'));
  cp(logWww, require.resolve('emulate-tab/dist/bundles/emulate-tab.amd.js'), path.join(wwwDir, 'emulate-tab.js'));
  logWww('assemble www done');
}