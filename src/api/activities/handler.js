const { activityMap } = require('../../utils/index');
const ClientError = require('../../exception/ClientError');
const ServerError = require('../../exception/ServerError');

class ActivityHandler {
  constructor(activityService, playlistService, songsService) {
    this._activityService = activityService;
    this._playlistService = playlistService;
    this._songsService = songsService;
    this.getActivityPlaylistHandler = this.getActivityPlaylistHandler.bind(this);
  }

  async getActivityPlaylistHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentials } = request.auth.credentials;
      await this._playlistService.verifyPlaylistOwner(id, credentials);
      const activities = await this._activityService.getActivity(id);
      return h.response({
        status: 'success',
        data: {
          playlistId: id,
          activities: activities.map((item) => activityMap(item)),
        },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response(error.toString()).code(error.statusCode);
      }

      console.log(error);
      return h.response(new ServerError('server sedanng error').toString())
        .code(500);
    }
  }
}

module.exports = ActivityHandler;
