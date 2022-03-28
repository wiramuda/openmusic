const ClientError = require("../../exception/ClientError");
const ServerError = require("../../exception/ServerError");

class AuthenticationsHandler{
    constructor(authenticationsService, userService, tokenManager, validator){
        this._authService = authenticationsService;
        this._userService = userService;
        this._tokenManager = tokenManager;
        this._validator = validator;
        // class method
        this.postAuthenticationsHandler = this.postAuthenticationsHandler.bind(this);
        this.putAuthenticationsHandler = this.putAuthenticationsHandler.bind(this);
        this.deleteAuthenticationsHandler = this.deleteAuthenticationsHandler.bind(this);
    }
    async postAuthenticationsHandler(request, h){
        try{
            this._validator.validateAuthenticationsPayload(request.payload);
            const { username, password } = request.payload;
            const  id  = await this._userService.verifyUserCredential(username, password);
            const accessToken = await this._tokenManager.generateAccessToken({ id });
            const refreshToken = await this._tokenManager.generateRefeshToken({ id });
            await this._authService.addRefreshToken(refreshToken);
            return h.response({
                status: 'success',
                data: {
                    accessToken,
                    refreshToken,
                    }
                }).code(201); 
        }catch(error){
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            // server error
            console.log(error);
            return h.response(new ServerError("server sedanng error").toString())
                .code(500);
        }
        
    }

    async putAuthenticationsHandler(request, h){
        try{
            const { refreshToken } = request.payload;
            await this._authService.verifyRefreshToken(refreshToken);
            const { id } = await this._tokenManager.verifyRefreshToken(refreshToken);
            const accessToken = await this._tokenManager.generateAccessToken(id);
            return h.response({
                status: 'success',
                data: {
                    accessToken,
                }
            }).code(200);
        }catch(error){
            if(error instanceof ClientError){
                return h.response(error.toString()).code(error.statusCode);
            }
            console.log(error);
            return h.response(new ServerError("server sedanng error").toString())
                .code(500);
        }
    }

    async deleteAuthenticationsHandler(request, h){
        try{
            const { refreshToken } = request.payload;
            await this._authService.deleteRefreshToken(refreshToken);
            return h.response({
                status: 'success',
                message: 'refresh token berhasil dihapus',
            }).code(200);
        }catch(error){
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            // server error
            console.log(error);
            return h.response(new ServerError("server sedanng error").toString())
                .code(500);
        }
    }
}

module.exports = AuthenticationsHandler;