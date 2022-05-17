const ClientError = require('../../exception/ClientError');
const ServerError = require('../../exception/ServerError');

class UploadHandler {
  constructor(service, validator, albumService) {
    this._service = service;
    this._validator = validator;
    this._albumService = albumService;

    this.postImageHandler = this.postImageHandler.bind(this);
  }

  async postImageHandler(request, h) {
    try {
      const { cover } = request.payload;
      this._validator.validateUpload(cover.hapi.headers);
      const filename = await this._service.writeFile(cover, cover.hapi);
      const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/cover/${filename}`;
      this._albumService.addCoverAlbum(request.params.id, coverUrl);
      return h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      }).code(201);
    } catch (error) {
      return error;
    }
  }
}

module.exports = UploadHandler;
