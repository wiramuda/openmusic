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
        }
    }
]