const InvariantError = require("../../exception/InvariantError");
const { UploadPayloadschema } = require("./schema")

const UploadValidator = {
    validateUpload: (headers) => {
        const result = UploadPayloadschema.validate(headers);

        if(result.error){
            throw new InvariantError(result.error.message);
        }
    }
}

module.exports = { UploadValidator };