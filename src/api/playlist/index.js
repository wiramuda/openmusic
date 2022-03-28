const PlaylistHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'playlist',
    version: '1.0.0',
    register: async(server, {service, songService, activityService, userService ,validator})=>{
        const playlistHandler = new PlaylistHandler(service, songService, activityService, userService ,validator);
        server.route(routes(playlistHandler));
    }
}