const ClientError = require("./ClientError");

class AuthorizationsError extends ClientError{
    constructor(message){
        super(message, 403);
        this.name = 'Authorizations Error'; 
    }
}
module.exports = AuthorizationsError;