/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');

class ActivityService {
  constructor() {
    this._pool = new Pool();

    this.addActivity = this.addActivity.bind(this);
    this.getActivity = this.getActivity.bind(this);
  }

  async addActivity(playlistId, songId, userId, action) {
    const activityId = `activity-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();
    const query = {
      text: 'insert into activity values($1,$2,$3,$4,$5,$6);',
      values: [activityId, playlistId, songId, userId, action, insertedAt],
    };

    const result = await this._pool.query(query);
    if (result.rowCount < 1) {
      throw new InvariantError('gagal menambahkan activity');
    }
    return true;
  }

  async getActivity(playlistId) {
    const query = {
      text: `select a.*, p.id, s.title, u.username 
                   from activity a
                   left join playlist p
                   on a.playlist_id = p.id 
                   left join songs s
                   on a.song_id = s.id
                   left join users u
                   on a.user_id = u.id 
                   where p.id = $1       
            `,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount < 0) {
      throw new NotFoundError('playlist tidak ada');
    }
    return result.rows;
  }
}
module.exports = ActivityService;
