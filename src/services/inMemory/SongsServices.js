/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const { mapDBToModel } = require('../../utils');

class SongsService {
  constructor() {
    this._songs = [];
  }

  addSong({
    title, year, performer, genre, duration,
  }) {
    const id = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const songs = {
      id, title, year, performer, genre, duration, insertedAt, updatedAt,
    };
    this._songs.push(songs);

    const isPush = this._songs.filter((item) => item.id === id)[0];
    if (isPush.length < 0) {
      throw new InvariantError('lagu gagal ditambahkan');
    }
    return isPush.id;
  }

  getSongs() {
    const songs = this._songs.map(mapDBToModel);
    return songs;
  }

  getSongById(id) {
    const songsFilter = this._songs.filter((item) => item.id === id)[0];
    if (!songsFilter) {
      throw new NotFoundError(`lagu tidak ditemukan ${id}`);
    }
    return songsFilter;
  }

  editSongById(id, {
    title, year, performer, genre, duration,
  }) {
    const updateAt = new Date().toISOString();
    const index = this._songs.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundError('lagu tidak berhasil diperbaharui');
    }

    this._songs[index] = {
      ...this._songs[index],
      title,
      year,
      performer,
      genre,
      duration,
      updateAt,
    };
  }

  deleteSongById(id) {
    const index = this._songs.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundError('lagu tidak ditemukan');
    }
    this._songs.splice(index, 1);
  }
}

module.exports = SongsService;
