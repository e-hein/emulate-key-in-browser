const baseConfig = require('./base.conf').config;
const httpServer = require('http-server');
const path = require('path');

const port = 4321;

exports.config = {
  ...baseConfig,

  baseUrl: `http://localhost:${port}/`,
  capabilities: require('./capability.chrome'),
  
  beforeLaunch() {
    server = httpServer.createServer({ root: path.resolve(__dirname, '../dist') });
    server.listen(port);
  },
  afterLaunch() {
    server.close();
  }
};
