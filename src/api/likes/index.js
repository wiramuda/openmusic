const LikesHandler = require("./handler")

module.exports = {
    name: 'likes',
    version: '1.0.0',
    register: (server, {service}) => {
        const likesHandler = new LikesHandler(service);
        server.route(routes(likesHandler));
    }
}