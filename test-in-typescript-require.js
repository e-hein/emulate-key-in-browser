const shell = require('shelljs');
const defaultOptions = {
  async: true,
  env: {
    ...process.env,
    FORCE_COLOR: 2,
  }
};
const inTypescriptRequireJs = {
  cwd: './test/in-typescript-requirejs',
};

function run(cmd, options = {}) {
  return new Promise((resolve, reject) => {
    shell.exec(cmd, { ...defaultOptions, ...options}, (error, stdout, stderr) => {
      if (error > 0) {
        reject({ code: error, stderr });
      } else {
        resolve(stdout);
      }
    })
  })
}

Promise.resolve()
  .then(() => run('npm i', inTypescriptRequireJs))
  .then(() => run('npm run coverage', inTypescriptRequireJs))
  .then(
    () => process.exit(0),
    (error) => process.exit(error.code)
  )
;
