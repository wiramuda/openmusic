const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exception/InvariantError");
const NotFoundError = require("../../exception/NotFoundError");
const AuthorizationsError = require('../../exception/AuthorizationsError');

class PlaylistService{
    constructor(collaborationService){
        this._pool = new Pool();
        this._collaborationService = collaborationService;
    }
    async addPlaylist(name, owner){
        const id = `playlist-${nanoid(16)}`;
        const query = {
            text: 'insert into playlist values($1,$2,$3) returning *',
            values: [id, name, owner],
        };
        const result = await this._pool.query(query);
        if(!result.rows.length){
            throw new InvariantError("playlist gagal ditambahkan");
        }
        return result.rows[0];
    }

    async getAllPlaylistByOwner(owner){
        const query = {
            text: `select p.id, p.name, u.username from playlist p 
                   inner join users u on p.owner = u.id 
                   where p.owner = $1 or 
                   p.id in 
                   (
                       select c.playlist_id 
                        from collaboration c 
                        where c.playlist_id = p.id and c.user_id = $1) ;`,
            values: [owner],
        };
        const result = await this._pool.query(query);
        if(result.rowCount < 0){
            throw new NotFoundError('anda tidak memiliki playlist silahkan tambahkan dulu');
        }
        return result.rows;
    }

    async deletePlaylist(id){
        const query = {
            text: 'delete from playlist where id = $1 returning id',
            values: [id],
        };
        const result = await this._pool.query(query);
        if(result.rowCount < 1){
            throw new InvariantError('gagal menghapus playlist');
        }
        return result.rows[0];
    }
    async verifyPlaylistOwner(id, owner){
        const query ={
            text: `select * from playlist p 
                   where p.id = $1`,
            values: [id],
        };
        const result = await this._pool.query(query);
        if(result.rowCount < 1){
            throw new NotFoundError('playlist tidak ditemukan');
        }
        if(result.rows[0].owner !== owner){
            throw new AuthorizationsError('anda tidak punya hak pada playlist ini');
        }
        return true;
    }

    async verifyAccessPlaylist(id, userId){
        try{
            await this.verifyPlaylistOwner(id, userId);
        }catch(error){
            if(error instanceof NotFoundError){
                throw error;
            }try{
                await this._collaborationService.verifyCollaboration(id, userId);

            }catch(error){
                throw error;
            }
        }
    }

    async addSongToPlaylist(playlistId, songId){
        const id = `playlistSongs-${nanoid(16)}`;
        const query = {
            text: 'insert into playlistsongs values($1,$2,$3) returning id',
            values: [id,songId,playlistId],
        }
        const result = await this._pool.query(query);
        if(result.rowCount < 1){
            throw new InvariantError(' gagal menambahkan lagu ke playlist');
        }
    }
    async getAllSongsInPlaylist(playlistId,owner){
        const query = {
            text: `select songs.*, playlist.owner, playlist.name 
                   from playlistsongs 
                   right join songs 
                   on playlistsongs.songs_id = songs.id 
                   right join playlist 
                   on playlistsongs.playlist_id = playlist.id
                   where playlistsongs.playlist_id = $1 and playlist.owner = $2
                   or playlist.id in 
                   (
                       select playlist_id 
                       from collaboration c 
                       where c.playlist_id = $1 and c.user_id = $2);`,
            values: [playlistId, owner],
        }
        const result = await this._pool.query(query);
        return result.rows;
    }
    async deleteSongFromPlaylist(songId){
        const query = {
            text: 'delete from playlistsongs where songs_id = $1',
            values: [songId],
        };
        const result = await this._pool.query(query);
        if(result.rowCount < 1){
            throw new InvariantError('gagal menghapus lagu dari playlist');
        }
    }

}
module.exports = PlaylistService;