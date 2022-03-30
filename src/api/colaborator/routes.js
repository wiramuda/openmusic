const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    options: {
      handler: handler.addCollaborationHandler,
      auth: 'songsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    options: {
      handler: handler.deleteCollaborationHandler,
      auth: 'songsapp_jwt',
    },
  },
];

module.exports = routes;
