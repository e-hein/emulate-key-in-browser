const shell = require('shelljs');
const defaultOptions = {
  async: true,
  env: {
    ...process.env,
    FORCE_COLOR: 2,
  }
};
const inAngular = {
  cwd: './test/in-angular-material',
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
  .then(() => run('npm i', inAngular))
  .then(() => run('npm run build', inAngular))
  .then(() => run('npm run update-webdriver' + (process.argv[3] ? ' -- --versions.chrome ' + process.argv[3] : ''), inAngular))
  .then(() => run('npm run test:build-result', inAngular))
  .then(
    () => process.exit(0),
    (error) => process.exit(error.code)
  )
;
