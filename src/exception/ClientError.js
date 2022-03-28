class ClientError extends Error{
    constructor(message, statusCode=400){
        super(message);
        this.statusCode = statusCode,
        this.name = 'Client Error'
    }
    toString(){
        return {
            status: 'fail',
            message: this.message
        }
    }
}
module.exports = ClientError;