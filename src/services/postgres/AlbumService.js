/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const mapTo = require('../../utils/albumUtils');

class AlbumService {
  constructor() {
    this._pool = new Pool();

    // class method
    this.addAlbum = this.addAlbum.bind(this);
    this.deleteAlbum = this.deleteAlbum.bind(this);
    this.updateAlbum = this.updateAlbum.bind(this);
    this.getAlbum = this.getAlbum.bind(this);
  }

  async addAlbum(name, year) {
    const albumId = `album-${nanoid(16)}`;
    const query = {
      text: 'insert into album values($1,$2,$3) returning id',
      values: [albumId, name, year],
    };
    const resultId = await this._pool.query(query);
    if (resultId.rowCount < 1) {
      throw new InvariantError('gagal menambahkan album');
    }

    return resultId.rows[0];
  }

  async getAlbum(albumId) {
    const query = {
      text: 'select a.*, s.id as song_id, s.title from album a left join songs s on a.id = s.album_id where a.id=$1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount < 1) {
      throw new NotFoundError('album tidak ada');
    }

    return mapTo(result.rows);
  }

  async addCoverAlbum(albumId, filename) {
    const query = {
      text: 'update album set coverUrl = $2 where id = $1 returning coverUrl ',
      values: [albumId, filename],
    };

    const resultUrl = await this._pool.query(query);
    if(resultId.rowCount < 1) {
      throw new NotFoundError('album tidak dapat ditemukan');
    }
    return resultUrl
  }


  async updateAlbum(albumId, name, value) {
    const query = {
      text: 'update album set name = $2, year = $3 where id = $1 returning id',
      values: [albumId, name, value],
    };
    const resultId = await this._pool.query(query);
    if (resultId.rowCount < 1) {
      throw new NotFoundError('album tidak dapat ditemukan');
    }
    return resultId.rows[0];
  }

  async deleteAlbum(albumId) {
    const query = {
      text: 'delete from album where id = $1 returning id',
      values: [albumId],
    };

    const resultId = await this._pool.query(query);
    if (resultId.rowCount < 1) {
      throw new NotFoundError('album tidak dapat ditemukan');
    }
  }
}

module.exports = AlbumService;
