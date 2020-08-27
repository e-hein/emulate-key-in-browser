const shell = require('shelljs');
const defaultOptions = {
  async: true,
  env: {
    ...process.env,
    FORCE_COLOR: 2,
  }
};
const inPlainHtmlJs = {
  cwd: './test/in-plain-html-js',
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
  .then(() => run('npm i', inPlainHtmlJs))
  .then(() => run('npm run test:once', inPlainHtmlJs))
  .then(() => run('npm build', inPlainHtmlJs))
  .then(
    () => process.exit(0),
    (error) => process.exit(error.code)
  )
;
