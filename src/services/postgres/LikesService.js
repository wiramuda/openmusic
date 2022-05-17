const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');

class LikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;

    this.toogleLikes = this.toogleLikes.bind(this);
    this.getAmountOfLikes = this.getAmountOfLikes.bind(this);
  }

  async toogleLikes(userId, albumId) {
    const query = {
      text: 'select user_id from likes where user_id=$1',
      values: [userId],
    };
    const userIdIsUp = await this._pool.query(query);
    if (userIdIsUp.rowCount === 1) {
      const queryDeleteLikes = {
        text: 'delete from likes where user_id=$2 and album_id=$1 returning user_id',
        values: [albumId, userId],
      };
      const result = await this._pool.query(queryDeleteLikes);
      if (!result) {
        throw new InvariantError('likes gagal dihapus');
      }
      await this._cacheService.delete(`songs:${albumId}`);
      return result.rows;
    }
    const likesId = `likes-${nanoid(16)}`;
    const queryAddLikes = {
      text: 'insert into likes values($1,$2,$3) returning user_id',
      values: [likesId, userId, albumId],
    };
    const result = await this._pool.query(queryAddLikes);
    if (!result) {
      throw new InvariantError('likes gagal ditambahkan');
    }
    await this._cacheService.delete(`songs:${albumId}`);

    return result.rows[0].user_id;
  }

  async getAmountOfLikes(albumId) {
    try {
      const result = await this._cacheService.get(`album:${albumId}`);
      return {
        likes: JSON.parse(result).likes,
        cache: true,
      };
    } catch (e) {
      const query = {
        text: 'select COUNT(album_id) as likes from likes where album_id=$1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      if (!result) {
        throw new InvariantError('album_id tidak ada');
      }
      this._cacheService.set(`album:${albumId}`, JSON.stringify(result.rows[0]));

      return {
        likes: result.rows[0].likes,
        cache: false,
      };
    }
  }
}

module.exports = LikesService;
