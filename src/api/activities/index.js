const ActivityHandler = require("./handler")
const routes = require('./routes');
module.exports = {
    name: 'activity_look_up',
    versioan: '1.0.0',
    register: async (server,{playlistService, activityService, songsService}) => {
        const activityHandler = new ActivityHandler(activityService, playlistService, songsService);
        server.route(routes(activityHandler));
    }
}