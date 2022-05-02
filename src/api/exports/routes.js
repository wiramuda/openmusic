const route = (handler) => [

    {
        method: 'POST',
        path: '/export/playlists/{playlistId}',
        options: {
            handler: handler.exportsHandler,
            auth: 'songsapp_jwt'
        }
    }
]