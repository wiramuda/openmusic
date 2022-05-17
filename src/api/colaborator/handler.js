/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exception/ClientError');
const ServerError = require('../../exception/ServerError');

class CollaborationsHandler {
  constructor(collaborationServices, playlistServices, userService, validator) {
    this._playslistService = playlistServices;
    this._userService = userService;
    this._collaborationService = collaborationServices;
    this._validator = validator;

    // method class
    this.addCollaborationHandler = this.addCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async addCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaboration(request.payload);
      const { id: credentials } = request.auth.credentials;
      const { playlistId, userId } = request.payload;
      await this._userService.getUserById(userId);
      await this._playslistService.verifyPlaylistOwner(playlistId, credentials);
      const collaborationId = await this._collaborationService.addCollaborationService(playlistId, userId);
      return h.response({
        status: 'success',
        data: {
          collaborationId,
        },
      }).code(201);
    } catch (error) {
      return error;
    }
  }

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaboration(request.payload);
      const { playlistId, userId } = request.payload;
      const { id: credentials } = request.auth.credentials;
      await this._playslistService.verifyPlaylistOwner(playlistId, credentials);
      await this._collaborationService.deleteCollaborationService(playlistId, userId);
      return h.response({
        status: 'success',
        message: 'berhasil dihapus',
      }).code(200);
    } catch (error) {
      return error;
    }
  }
}

module.exports = CollaborationsHandler;
