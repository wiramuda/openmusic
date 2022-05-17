const routes = (handler) => [
  {
    path: '/albums/{id}/likes',
    method: 'POST',
    options: {
      auth: 'songsapp_jwt',
      handler: handler.postLikesHandler,
    },
  },
  {
    path: '/albums/{id}/likes',
    method: 'GET',
    options: {
      handler: handler.getLikesHandler,
    },
  },
];

module.exports = routes;
