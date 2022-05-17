/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exception/ClientError');
const ServerError = require('../../exception/ServerError');
const { mapResponse } = require('../../utils');

class PlaylistHandler {
  constructor(service, songService, activityService, userService, validator) {
    this._service = service;
    this._songService = songService;
    this._validator = validator;
    this._activityService = activityService;
    this._userService = userService;

    // classs method
    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getAllPlaylistByOwnerHandler = this.getAllPlaylistByOwnerHandler.bind(this);
    this.deleteOwnerPlaylistByIdHandler = this.deleteOwnerPlaylistByIdHandler.bind(this);
    this.addSongsToPlaylistHandler = this.addSongsToPlaylistHandler.bind(this);
    this.getAllSongsInPlaylistHandler = this.getAllSongsInPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentials } = request.auth.credentials;
      const playlist = await this._service.addPlaylist(name, credentials);
      const response = h.response({
        status: 'success',
        message: 'playlist berhasil ditambahkan',
        data: {
          playlistId: playlist.id,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getAllPlaylistByOwnerHandler(request, h) {
    try {
      const { id: credentials } = request.auth.credentials;
      const playlists = await this._service.getAllPlaylistByOwner(credentials);
      const response = h.response({
        status: 'success',
        data: {
          playlists,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      return error;
    }
  }

  async deleteOwnerPlaylistByIdHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentials } = request.auth.credentials;
      await this._service.verifyPlaylistOwner(playlistId, credentials);
      await this._service.deletePlaylist(playlistId);
      const response = h.response({
        status: 'success',
        message: 'playlist berhasil di hapus',
      });
      response.code(200);
      return response;
    } catch (error) {
      return error;
    }
  }

  async addSongsToPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistSongIdPayload(request.payload);
      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentials } = request.auth.credentials;
      await this._service.verifyAccessPlaylist(playlistId, credentials);
      await this._songService.getSongById(songId);
      await this._service.addSongToPlaylist(playlistId, songId);
      await this._activityService.addActivity(playlistId, songId, credentials, 'add');
      const response = h.response({
        status: 'success',
        message: 'lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getAllSongsInPlaylistHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentials } = request.auth.credentials;
      await this._service.verifyAccessPlaylist(playlistId, credentials);
      const songs = await this._service.getAllSongsInPlaylist(playlistId, credentials);
      const users = await this._userService.getUserById(songs[0].owner);
      return h.response({
        status: 'success',
        data: {
          playlist: {
            id: songs[0].id,
            name: songs[0].name,
            username: users.username,
            songs: songs.map(mapResponse),
          },
        },
      }).code(200);
    } catch (error) {
      return error;
    }
  }

  async deleteSongFromPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistSongIdPayload(request.payload);
      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentials } = request.auth.credentials;
      await this._service.verifyAccessPlaylist(playlistId, credentials);
      await this._service.deleteSongFromPlaylist(songId);
      await this._activityService.addActivity(playlistId, songId, credentials, 'delete');
      const response = h.response({
        status: 'success',
        message: 'lagu berhasil dihapus dari playlist',
      });
      response.code(200);
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = PlaylistHandler;
