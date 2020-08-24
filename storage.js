const fs = require('fs')
const path = require('path');
const { execSync } = require('child_process');

const host = Buffer.from(process.env.STORAGE_HOST_KEY, 'base64').toString();
const key = Buffer.from(process.env.STORAGE_IDENTITY, 'base64').toString();
const url = process.env.STORAGE_URL;

const hostFilename = './known_hosts';
const keyFilename = './rsa_key';
const autFiles = [hostFilename, keyFilename];
const sshCmd = `ssh -i ${keyFilename} -o UserKnownHostsFile=${hostFilename} -o StrictHostKeyChecking=yes`;

function writeAuthFiles() {
  fs.writeFileSync(hostFilename, host);
  fs.writeFileSync(keyFilename, key);
  execSync('chmod 600 ' + keyFilename);
}

function removeAuthFiles() {
  if(global.KEEP_AUTH_FILES) return;
  autFiles.forEach((authFile) => fs.unlinkSync(authFile));
}

function debug() {
  console.log({ host, key }); 
}

/**
 * 
 * @param {string} from 
 * @param {string} to 
 */
function upload(from, to) {
  console.log(`upload`, { from, to });
  writeAuthFiles();
  try {
    const basePath = path.dirname(to);
    if (basePath.length > 1) {
      const mkdirCmd = `${sshCmd} ${url} "mkdir -p ${basePath}"`;
      console.log(mkdirCmd);
      execSync(mkdirCmd, { stdio: 'inherit' });
    }
    const copyCmd = `rsync -rpvl -e "ssh -i ${keyFilename} -o UserKnownHostsFile=${hostFilename} -o StrictHostKeyChecking=yes" ${from} ${url}:${to}`;
    console.log({ cmd: copyCmd });
    execSync(copyCmd, { stdio: 'inherit' });
    removeAuthFiles();
  } catch (e) {
    removeAuthFiles();
    console.error(e);
    process.exit(e.code || 1);    
  }
}

function download(from, to) {
  console.log(`download`, { from, to });
  writeAuthFiles();
  try {
    const basePath = path.dirname(to);
    if (basePath.length > 1) {
      const mkdirCmd = `mkdir -p ${basePath}`;
      console.log(mkdirCmd);
      execSync(mkdirCmd, { stdio: 'inherit' });
    }
    const copyCmd = `rsync -rpvl -e "ssh -i ${keyFilename} -o UserKnownHostsFile=${hostFilename} -o StrictHostKeyChecking=yes" ${url}:${from} ${to}`;
    console.log({ cmd: copyCmd });
    execSync(copyCmd, { stdio: 'inherit' });
    removeAuthFiles();
  } catch (e) {
    removeAuthFiles();
    console.error(e);
    process.exit(e.code || 1);    
  }
}

if (process.argv[2] === 'upload') {
  const from = process.argv[3];
  const to = process.argv[4];
  upload(from, to);
} else if (process.argv[2] === 'download') {
  const from = process.argv[3];
  const to = process.argv[4];
  download(from, to);
}


module.exports = {
  debug,
  upload,
};