/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const { mapDBToModel, mapResponse } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();

    const query = {
      text: 'insert into songs values($1,$2,$3,$4,$5,$6,$7,$7,$8) returning id',
      values: [id, title, year, performer, genre, duration, insertedAt, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw InvariantError('lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs(filter) {
    const query = {
      text: 'select s.id as songId, s.title, s.performer from songs as s',
    };

    if (filter.title && filter.performer) {
      query.text = 'select s.id as songId, s.title, s.performer from songs as s where lower(title) like $1 and lower(performer) like $2;';
      query.values = [`${filter.title}%`, `${filter.performer}%`];
    }

    if (filter.title && !filter.performer) {
      query.text = 'select s.id as songId, s.title, s.performer from songs as s where lower(title) like $1;';
      query.values = [`${filter.title}%`];
    }

    if (filter.performer && !filter.title) {
      query.text = 'select s.id as songId, s.title, s.performer from songs as s where lower(performer) like $1;';
      query.values = [`${filter.performer}%`];
    }

    const result = await this._pool.query(query);
    return result.rows.map(mapResponse);
  }

  async getSongById(id) {
    const query = {
      text: 'select * from songs where id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError(`lagu tidak ditemukan ${id}`);
    }
    return result.rows.map(mapDBToModel)[0];
  }

  async editSongById(id, {
    title, year, performer, genre, duration,
  }) {
    const query = {
      text: 'update songs set title =$1, year =$2, performer =$3, genre =$4, duration=$5 where id =$6 returning id',
      values: [title, year, performer, genre, duration, id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError('gagal memperbaharui lagu, Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'delete from songs where id =$1 returning id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (result.rowCount < 1) {
      throw new NotFoundError('lagu gagal dihapus, Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
