const routes = (handlers) => [
    {
        path: '/playlists/{id}/activities',
        method: 'GET',
        options: {
            handler: handlers.getActivityPlaylistHandler,
            auth: 'songsapp_jwt'
        }
    }
]

module.exports = routes;