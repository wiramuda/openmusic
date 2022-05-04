const ClientError = require("../../exception/ClientError");
const ServerError = require('../../exception/ServerError');
class LikesHandler{
    constructor(service) {
        this._service = service;
    }

    async postLikesHandler(request, h) {
        try{
            const { id } = request.auth.credentials;
            const { id: albumId } = request.params;
            const userId = await this._service.toogleLikes(id, albumId);
            return h.response({
                status: 'success',
                message: 'likes berhasil diperbaharui'
            }).code(201);
        }catch(e){
            if(e instanceof ClientError){
                return h.response(e.toString()).code(e.statusCode);
            }
            return h.response(
                new ServerError('server bermasalah').toString()
            ).code(500);
        }
    }

    async getLikesHandler(request, h) {
        try {
            const {id: albumId} = request.params;
            const amountOfLikes = await this._service.getAmountOfLikes(albumId);
            return h.response({
                status: 'success',
                data: {
                    likes: amountOfLikes,
                }
            }).code(201);
        }catch(e) {
            if(e instanceof ClientError){
                return h.response(e.toString()).code(e.statusCode);
            }
            return h.response(
                new ServerError('server bermasalah').toString()
            ).code(500);
        }
    }

}

module.exports = LikesHandler;