const fs = require('fs')
const path = require('path');
const { execSync } = require('child_process');

const host = Buffer.from(process.env.STORAGE_HOST_KEY, 'base64').toString();
const key = Buffer.from(process.env.STORAGE_IDENTITY, 'base64').toString();
const url = process.env.STORAGE_URL;

const hostFilename = './known_hosts';
const keyFilename = './rsa_key';
const autFiles = [hostFilename, keyFilename];
const userHome = execSync('cd ~; pwd').toString().trim();
const sshCmd = `ssh -i ${keyFilename} -o UserKnownHostsFile=${hostFilename} -o StrictHostKeyChecking=yes`;
const sshConfigPath = path.join(userHome, '.ssh/config');
const sshConfigBackup = path.join(userHome, '.ssh/orig-ssh-config-something-29734829');

function writeAuthFiles() {
  fs.writeFileSync(hostFilename, host);
  fs.writeFileSync(keyFilename, key);
  execSync('chmod 600 ' + keyFilename);
}

function removeAuthFiles() {
  if(process.env.KEEP_AUTH_FILES === 'true') return;
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
    const copyCmd = `rsync -rpvl -e "${sshCmd}" ${from} ${url}:${to}`;
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
    const copyCmd = `rsync -rpvl -e "${sshCmd}" ${url}:${from} ${to}`;
    console.log({ cmd: copyCmd });
    execSync(copyCmd, { stdio: 'inherit' });
    removeAuthFiles();
  } catch (e) {
    removeAuthFiles();
    console.error(e);
    process.exit(e.code || 1);    
  }
}

/**
 * 
 * @param {'update' | 'approve' | 'rollback' } cmd
 * @param {string} stage 
 * @param {string} src 
 */
function deploy(cmd, stage, src) {
  if (!['update', 'approve', 'rollback'].includes(cmd)) {
    throw new Error('unknown cmd: ' + cmd);
  }
  const result = authenticatedSsh(['travis@net-root.de', `"~/${cmd}.sh"`, 'emulate-key-in-browser', stage, src]);
  console.log('update result:', result);
}

function auth(target) {
  console.log(`auth`, { target });
  try {
    const result = authenticatedSsh(['-T', target]);
    if (!/successfully authenticated/.test(result)) {
      throw new Error('failed: ' + result);
    }
  } catch (e) {
    if (!/successfully authenticated/.test(e.stderr)) {
      console.error(e);
      process.exit(e.code || 1);    
    }
  }
}

function authenticatedSsh(args) {
  console.log(`ssh`, args);
  writeAuthFiles();
  try {
    const result = execSync(`${sshCmd} ` + args.join(' '));
    return result;
  } catch (e) {
    throw e;
  } finally {
    removeAuthFiles();
  }
}

function authGit(hostAlias) {
  console.log(`authGit`);
  writeAuthFiles();
  let config = '';
  if (exists(sshConfigPath)) {
    config = fs.readFileSync(sshConfigPath, 'utf-8') + '\n\n\n';
    if (!exists(sshConfigBackup)) execSync(`mv ${sshConfigPath} ${sshConfigBackup}`);
  }
  config += `
  Host ${hostAlias}
    Hostname github.com
    User git
    IdentityFile ${path.resolve(keyFilename)}
  `
  fs.writeFileSync(sshConfigPath, config);
}

/**
 * checks if a file exist
 * 
 * @param {string} filename 
 */
function exists(filename) {
  try {
    fs.accessSync(filename, constants.R_OK);
    return true;
  } catch (e) {
    return false;
  }
}

function unAuthGit() {
  console.log('unAuthGit');
  if (exists(sshConfigBackup)) {
    execSync(`mv ${sshConfigBackup} ${sshConfigPath}`);
  } else {
    fs.unlinkSync(sshConfigPath);
  }
  removeAuthFiles();
}



if (process.argv[2] === 'upload') {
  const from = process.argv[3];
  const to = process.argv[4];
  upload(from, to);
} else if (process.argv[2] === 'download') {
  const from = process.argv[3];
  const to = process.argv[4];
  download(from, to);
} else if (process.argv[2] === 'auth') {
  const target = process.argv[3];
  auth(target);
} else if (process.argv[2] === 'authGit') {
  const hostAlias = process.argv[3];
  authGit(hostAlias);
} else if (process.argv[2] === 'unAuthGit') {
  unAuthGit();
} else if (process.argv[2] === 'ssh') {
  args = process.argv.slice(3);
  authenticatedSsh(args);
} else if (process.argv[2] === 'deploy') {
  cmd = process.argv[3];
  stage = process.argv[4];
  src = process.argv[5];
  deploy(cmd, stage, src);
}


module.exports = {
  debug,
  upload,
  auth,
};