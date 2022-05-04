const { nanoid } = require('nanoid');
const { Pool } = require('pg');

class LikesService {
    constructor(){
        this._pool = new Pool();
    }

    async toogleLikes(userId, albumId){
        const query = {
            text: 'select userId from likes where userId=$1 returning userId',
            values: [userId],
        }
        const userIdIsUp = await this._pool.query(query);
        if(!userIdIsUp) {
            const queryDeleteLikes = {
                text: 'delete likes userId=$2 where albumId=$1 returning userId',
                values: [albumId, userId],
            }
            const result = await this._pool.query(queryDeleteLikes);
            if (!result) {
                throw new InvariantError('likes gagal dihapus');
              }
        }
        const likesId = `likes-${nanoid(16)}`;
        const queryAddLikes = {
            text: 'insert into likes values($1,$2,$3) returning userId',
            values: [likesId,albumId, userId]
        }
        const result = await this._pool.query(queryAddLikes);
        if (!result) {
            throw new InvariantError('likes gagal ditambahkan');
          }
        return result.rows[0].userId;
    }

    async getAmountOfLikes(albumId) {
        const query = {
            text: 'select COUNT(albumId) from likes where albumId=$1',
            values: [albumId]
        }
        const result = await this._pool.query(query);
        if (!result) {
            throw new InvariantError('albumId tidak ada');
          }
        return result.row;
    }
}

module.exports = LikesService;