const { Pool } = require('pg');
const mapResponse = require('../utils/mapResponse');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(playlistId, userId) {
    const query = {
      text: `select s.id as songId, s.title, s.performer, p.id, p.name 
            from playlistsongs ps
            right join songs s on ps.songs_id = s.id 
            right join playlist p on ps.playlist_id = p.id
            left join collaboration c on ps.playlist_id = c.playlist_id
            where ps.playlist_id = $1 and p.owner = $2 or c.user_id = $2 and ps.playlist_id = $1
            `,
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    const playlist = {
      palylist: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        songs: result.rows.map(mapResponse),
      },
    };
    return playlist;
  }
}

module.exports = SongsService;
