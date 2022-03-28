const routes = (handlers) => [
    {
        method: 'POST',
        path: '/albums',
        options: {
            handler: handlers.addAlbumHandler, 
        }
    },
    {
        method: 'GET',
        path: '/albums/{albumId}',
        options: {
            handler: handlers.getAlbumByIdHandler, 
        }
    },
    {
        method: 'PUT',
        path: '/albums/{albumId}',
        options: {
            handler: handlers.updateAlbumHandler, 
        }
    },
    {
        method: 'DELETE',
        path: '/albums/{albumId}',
        options: {
            handler: handlers.deleteAlbumByIdHandler, 
        }
    }
]

module.exports = routes;