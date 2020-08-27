const shell = require('shelljs');
const defaultOptions = {
  async: true,
  env: {
    ...process.env,
    FORCE_COLOR: 2,
  }
};
const inDemo = {
  cwd: './demo',
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
  .then(() => run('npm i', inDemo))
  .then(() => run('node build.js', inDemo))
  .then(
    () => process.exit(0),
    (error) => process.exit(error.code)
  )
;
