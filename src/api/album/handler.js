/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exception/ClientError');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const ServerError = require('../../exception/ServerError');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.addAlbumHandler = this.addAlbumHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.updateAlbumHandler = this.updateAlbumHandler.bind(this);
  }

  async addAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const albumId = await this._service.addAlbum(name, year);
      return h.response({
        status: 'success',
        data: {
          albumId: albumId.id,
        },
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response(error.toString()).code(400);
      }
      console.log(error);
      return h.response(new ServerError('server sedanng error').toString())
        .code(500);
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { albumId } = request.params;
      const album = await this._service.getAlbum(albumId);
      return h.response({
        status: 'success',
        data: {
          album,
        },
      }).code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response(error.toString()).code(404);
      }
      console.log(error);
      return h.response(new ServerError('server sedanng error').toString())
        .code(500);
    }
  }

  async updateAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const { albumId } = request.params;
      await this._service.updateAlbum(albumId, name, year);
      return h.response({
        status: 'success',
        message: 'album berhasil diperbaharui',
      }).code(200);
    } catch (error) {
      if (error instanceof InvariantError) {
        return h.response(error.toString()).code(400);
      } if (error instanceof NotFoundError) {
        return h.response(error.toString()).code(404);
      }
      console.log(error);
      return h.response(new ServerError('server sedanng error').toString())
        .code(500);
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { albumId } = request.params;
      await this._service.deleteAlbum(albumId);

      return h.response({
        status: 'success',
        message: 'album berhasil dihapus',
      }).code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response(error.toString()).code(404);
      }
      console.log(error);
      return h.response(new ServerError('server sedanng error').toString())
        .code(500);
    }
  }
}

module.exports = AlbumHandler;
