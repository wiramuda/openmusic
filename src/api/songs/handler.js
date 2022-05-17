/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exception/ClientError');
const ServerError = require('../../exception/ServerError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // class method
    this.postSongsHandler = this.postSongsHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongsHandler(request, h) {
    try {
      this._validator.validateSongsPayload(request.payload);
      const {
        title, year, performer, genre, duration, albumId,
      } = request.payload;
      const songId = await this._service.addSong({
        title, year, performer, genre, duration, albumId,
      });
      const response = h.response({
        status: 'success',
        message: 'lagu berhasil ditambahan',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getSongsHandler(request, h) {
    const songs = await this._service.getSongs(request.query);
    return h.response({
      status: 'success',
      data: {
        songs,
      },
    }).code(200);
  }

  async getSongByIdHandler(request, h) {
    try {
      const { songId } = request.params;
      const song = await this._service.getSongById(songId);
      return h.response({
        status: 'success',
        data: {
          song,
        },
      }).code(200);
    } catch (error) {
      return error;
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongsPayload(request.payload);
      const { songId } = request.params;
      const {
        title, year, performer, genre, duration, albumId,
      } = request.payload;
      await this._service.editSongById(songId, {
        title, year, performer, genre, duration, albumId,
      });
      return h.response({
        status: 'success',
        message: 'lagu berhasil diperbaharui',
      }).code(200);
    } catch (error) {
      return error;
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { songId } = request.params;
      await this._service.deleteSongById(songId);
      return h.response({
        status: 'success',
        message: `lagu berhasil dihapus ${songId}`,
      }).code(200);
    } catch (error) {
      return error;
    }
  }
}

module.exports = SongsHandler;
