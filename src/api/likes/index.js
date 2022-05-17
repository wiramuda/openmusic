const LikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likes',
  version: '1.0.0',
  register: (server, { service, albumService }) => {
    const likesHandler = new LikesHandler(service, albumService);
    server.route(routes(likesHandler));
  },
};
