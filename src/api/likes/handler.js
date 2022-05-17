const ServerError = require('../../exception/ServerError');

class LikesHandler {
  constructor(service, albumService) {
    this._service = service;
    this._albumService = albumService;

    this.postLikesHandler = this.postLikesHandler.bind(this);
    this.getLikesHandler = this.getLikesHandler.bind(this);
  }

  async postLikesHandler(request, h) {
    try {
      const { id } = request.auth.credentials;
      const { id: albumId } = request.params;
      await this._albumService.getAlbum(albumId);
      await this._service.toogleLikes(id, albumId);
      return h.response({
        status: 'success',
        message: 'likes berhasil diperbaharui',
      }).code(201);
    } catch (e) {
      return e;
    }
  }

  async getLikesHandler(request, h) {
    try {
      const { id: albumId } = request.params;
      await this._albumService.getAlbum(albumId);
      const result = await this._service.getAmountOfLikes(albumId);
      const response = h.response({
        status: 'success',
        data: {
          likes: parseInt(result.likes),
        },
      }).code(200);
      if (result.cache) {
        return response.header('X-Data-Source', 'cache');
      }
      return response;
    } catch (e) {
      return e;
    }
  }
}

module.exports = LikesHandler;
