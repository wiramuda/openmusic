const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  version: '1.0.0',
  name: 'exports',
  register: async (server, { service, validator, playlistService }) => {
    const exportsHandler = new ExportsHandler(service, validator, playlistService);
    await server.route(routes(exportsHandler));
  },
};
