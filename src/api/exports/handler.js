const ClientError = require("../../exception/ClientError");
const ServerError = require("../../exception/ServerError");

class ExportsHandler{
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
    }

    async exportsHandler(request, h){
        try{
            await this._validator.validateExportsPayload(request.payload);
            const message = {
                email: request.payload.targetEmail,
                userId: request.auth.credentials.id, 
            }
    
            this._service.sendMessage('exports:playlist' ,JSON.stringify(message));
            return h.response({
                status: 'success',
                message: 'Permintaan Anda sedang kami proses'
            }).code(201);
        }catch(e) {
            if(e instanceof ClientError) {
                return h.response(e.toString()).code(e.statusCode);
            }
            console.log(e.message)
            return h.response(new ServerError('server sedang maintanance').toString()).code(500);s
        }

    }
}

module.exports = ExportsHandler;