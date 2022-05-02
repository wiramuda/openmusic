const ClientError = require("../../exception/ClientError");
const ServerError = require("../../exception/ServerError");

class UploadHandler{
    constructor(service, validator, albumService) {
        this._service = service;
        this._validator = validator;
        this._albumService = albumService
    }

    async postImageHandler(request, h){
        try {
            const {cover} = request.payload;
            this._validator.validateUpload(cover.hapi.headers);
            const filename = await this._service.writeFile(cover, cover.hapi);
            this._albumService.addCoverAlbum(request.params.id, filename);
            return h.response({
                status: 'success',
                message: 'Sampul berhasil diunggah',
            }).code(201);
        }catch(error){
            if(error instanceof ClientError){
                return h.response(error.toString()).code(error.statusCode);
            }
            return h.response(new ServerError('error pada server').toString()).code(500);
        }
    }
}

module.exports = UploadHandler;