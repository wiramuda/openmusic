const path = require('path');

const routes = (handler) => [
  {
    path: '/albums/{id}/covers',
    method: 'POST',
    options: {
      handler: handler.postImageHandler,
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file'),
      },
    },
  },
];

module.exports = routes;
