const ClientError = require('../../exception/ClientError');
const ServerError = require('../../exception/ServerError');

class ExportsHandler {
  constructor(service, validator, playlistService) {
    this._service = service;
    this._validator = validator;
    this._playlistService = playlistService;

    this.exportsHandler = this.exportsHandler.bind(this);
  }

  async exportsHandler(request, h) {
    try {
      await this._validator.validateExportspayload(request.payload);
      const message = {
        email: request.payload.targetEmail,
        userId: request.auth.credentials.id,
        playlistId: request.params.playlistId,
      };
      await this._playlistService.verifyAccessPlaylist(message.playlistId, message.userId);
      await this._service.sendMessage('export:songs', JSON.stringify(message));
      return h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      }).code(201);
    } catch (e) {
      return e;
    }
  }
}

module.exports = ExportsHandler;
