/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exception/InvariantError');
const AuthorizationsError = require('../../exception/AuthorizationsError');

class CollaborationService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaborationService(playlistId, userId) {
    const collabId = `collaboration-${nanoid(16)}`;
    const query = {
      text: 'insert into collaboration values($1, $2, $3) returning id',
      values: [collabId, playlistId, userId],
    };

    const resultId = await this._pool.query(query);
    if (resultId.rowCount < 0) {
      throw new InvariantError('kolaborasi gagal ditambahkan');
    }
    return resultId.rows[0].id;
  }

  async deleteCollaborationService(playlistId, userId) {
    const query = {
      text: 'delete from collaboration where playlist_id=$1 and user_id=$2 returning id',
      values: [playlistId, userId],
    };
    const resultId = await this._pool.query(query);
    if (!resultId) {
      throw new InvariantError('kolaborasi gagal dihapus');
    }
  }

  async verifyCollaboration(playlistId, userId) {
    const query = {
      text: 'select * from collaboration where playlist_id = $1 and user_id = $2;',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount < 1) {
      throw new AuthorizationsError('anda tidak punya hak pada playlist ini');
    }
    return true;
  }
}

module.exports = CollaborationService;
