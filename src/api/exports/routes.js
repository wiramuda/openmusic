const routes = (handler) => [

  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    options: {
      handler: handler.exportsHandler,
      auth: 'songsapp_jwt',
    },
  },
];
module.exports = routes;
