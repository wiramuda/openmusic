const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exception/InvariantError");
const NotFoundError = require("../../exception/NotFoundError");
const AuthenticationsError = require("../../exception/AuthenticationsError");

class UserService{
    constructor(){
        this._pool = new Pool();
    }

    async addUser({username, password, fullname}){
        await this.verifyNewUsername(username);
        const userId = `user-${nanoid(16)}`;
        const hastedPassword = await bcrypt.hash(password,10);
        const query = {
            text: 'insert into users values($1,$2,$3,$4) returning id',
            values: [userId,username, hastedPassword, fullname],
        }
        const result = await this._pool.query(query);
        if(result.rowCount < 1){
            throw new InvariantError('User gagal ditambahkan')
        }
        return result.rows[0].id;
    };

    async verifyNewUsername(username){
        const query = {
            text: 'select username from users where username = $1',
            values:[username],
        }
        const result = await this._pool.query(query);
        if(result.rowCount > 0){
            throw new InvariantError('Gagal menambahan user. username sudah digunakan.')
        }
    }
    async getUserById(userId){
        const query = {
            text: 'select id,username,fullname from users where id = $1',
            values: [userId],
        };
        const result = await this._pool.query(query);
        if(result.rowCount < 1){
            throw new NotFoundError('user tidak ditemukan');
        }
        return result.rows[0];
    }
    async verifyUserCredential(username, password){
        const query = {
            text: 'select id, password from users where username = $1',
            values: [username],
        };
        const result = await this._pool.query(query);
        if(result.rowCount < 1){
            throw new AuthenticationsError('username yang anda berikan salah');
        }
        const { id, password:hashpassword } = result.rows[0];
        const match = await bcrypt.compare(password, hashpassword);
        if(!match){
            throw new AuthenticationsError('password yang anda berikan salah');
        }
        return id;
    }
}
module.exports = UserService;