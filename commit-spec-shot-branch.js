"use strict";

const fs = require('fs');
const path = require('path');
const createLogMethod = require('debug');
const { X_OK } = require('constants');
const info = createLogMethod('commit-spec-shots:info');
const detail = createLogMethod('commit-spec-shots:detail');
const debug = createLogMethod('commit-spec-shots:---debug');
const { execSync } = require('child_process');

const baseDir = path.join(__dirname, 'test/in-angular-material');
const specShotDir = path.join(baseDir, 'spec-shots');
const actualDir = path.join(specShotDir, 'actual');
const baselineDir = path.join(specShotDir, 'baseline');

const specShotBranchSuffix = '-spec-shots';
const specShotCommitMessage = 'updated spec shots';
const repositoryName = 'emulate-key/emulate-key-in-browser';

info('start commit spec shots');
const hasToPop = cleanUpWorkingDirectory();
try {
  const currentBranch = getCurrentBranch();
  ensureNotSpecShotBranch(currentBranch);
  const specShotBranch = createSpecShotBranch(currentBranch);

  try {
    removeOldBaseline();
    moveActualToBaseline();
    try {
      pushNewBaseline(specShotBranch);
    } catch (e) {
      console.error(e);
    }
    restoreActualFromBaseline();
  } catch (e) {
    console.error(e);
  }
  
  resetBranch();
  checkout(currentBranch);
  forceDeleteBranch(specShotBranch);
} catch (e) {
  console.error(e);
} 

restoreUncommittedChanges(hasToPop);
info('end commit spec shots');

/** DETAILS */

/**
 * stage, commit and push new baseline
 * 
 * @param {string} branchName  
 */
function pushNewBaseline(branchName) {
  info('start pushing new baseline');
  execLogged('stage new baseline', '', `git add ${baselineDir}`);
  execLogged('commit new baseline', '', `git commit -m '${specShotCommitMessage}'`);
  const remoteUrl = `git@authenticatedGit:${repositoryName}.git`;
  execLogged('add authenticated remote', `: ${remoteUrl}`, `git remote add authenticated ${remoteUrl}`);
  execSync('node storage.js authGit authenticatedGit');
  try {
    execLogged('push new baseline', `: ${branchName}`, `git push --set-upstream authenticated ${branchName}`);
  } catch (e) {
    throw e;
  } finally {
    execSync('node storage.js unAuthGit');
    execLogged(`remove authenticated remote`, `: ${remoteUrl}`, `git remote remove authenticated`);
  }
  info('end pushing new baseline');
}

function resetBranch() {
  execLogged('reset branch', '', `git reset --hard`);
}

function moveActualToBaseline() {
  execLogged('move actual to baseline', ':' + baselineDir, `mv ${actualDir} ${baselineDir}`);
}

function restoreActualFromBaseline() {
  execLogged('restore actual from baseline', ':' + baselineDir, `mv ${baselineDir} ${actualDir}`);
}

function removeOldBaseline() {
  execLogged('remove old baseline', ':' + baselineDir, `rm -rf ${baselineDir}`);
}

/**
 * git branch -D <branchName>
 * 
 * @param {string} branchName
 */
function forceDeleteBranch(branchName) {
  execLogged('forceDeleteBranch', ': ' + branchName, `git branch -D ${branchName}`);
}

/**
 * git checkout <branchName>
 * 
 * @param {string} branchName 
 */
function checkout(branchName) {
  execLogged('checkout', ': ' + branchName, `git checkout ${branchName}`);
}

/**
 * exec a command and log to appropriate log legel
 * @param {string} title 
 * @param {string} detailsForStart
 * @param {string} command 
 */
function execLogged(title, detailsForStart, command) {
  detail(title + detailsForStart);
  try {
    debug(`${title} cmd: ${command}`);
    const result = execSync(command);
    debug(`${title} result: ${result}`);
    return result;
  } catch(e) {
    throw andLogOutputs(e);
  }
}

/**
 * @param {string} currentBranch 
 */
function createSpecShotBranch(currentBranch) {
  const specShotBranch = currentBranch + specShotBranchSuffix;
  execLogged('createSpecShotBranch', ': ' + specShotBranch, `git checkout -b ${specShotBranch}`);
  return specShotBranch;
}

/**
 * 
 * @param {string} currentBranch 
 */
function ensureNotSpecShotBranch(currentBranch) {
  if (currentBranch.endsWith(specShotBranchSuffix)) {
    throw andLogError(`already on spec shot branch (current branch '${currentBranch}' ends with spec shot branch suffix '${specShotBranchSuffix}')`);
  }
}

function getCurrentBranch() {
  const gitStatus = execLogged('git status', '', `git status`).toString();
  const currentBranchParts = gitStatus.match(/^.* ([^ ]+)\n/);
  debug('git status matched', currentBranchParts);
  const currentBranch = currentBranchParts[1];
  detail('get current branch: ', currentBranch);
  if (typeof currentBranch !== 'string' || currentBranch.length < 3) {
    throw andLogError(`could not detect current branch (${currentBranch})`);
  }
  return currentBranch;
}

function cleanUpWorkingDirectory() {
  detail('check actualDir: ' + actualDir);
  try {
    fs.accessSync(actualDir, X_OK);
  } catch (e) {
    throw andLogError('no spec shots found in: ' + actualDir);
  }
  
  const stashResult = execSync('git stash').toString().trim();
  const hasToPop = stashResult !== 'No local changes to save';
  debug('stash result: %s -> %s', stashResult, hasToPop);
  return hasToPop;
}

/**
 * logs an error with outputs from an exec command
 * 
 * @param {string} msg 
 * @param { stdout: Buffer, stderr: Buffer } outputs 
 * 
 * @returns {Error}
 */
function andLogOutputs(e) {
  return andLogError(e.message, {
    stdout: e.stdout.toString(),
    stderr: e.stderr.toString(),
  });
}

/**
 * logs an error with additional args and returns an error object with the given message
 * 
 * @param {string} msg 
 * @param {...any[]} args 
 * 
 * @returns {Error}
 */
function andLogError(msg, args) {
  console.error(msg, args);
  return new Error(msg);
}

/**
 * stash pop if hasToPop
 * 
 * @param {boolean} hasToPop 
 */
function restoreUncommittedChanges(hasToPop) {
  detail('restoreUncommittedChanges: ' + hasToPop);
  if (hasToPop) {
    debug(execSync('git stash pop').toString());
  }
}
