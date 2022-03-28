const InvariantError = require("../../exception/InvariantError");
const { userSchema } = require("./schema");
const validationResult = {
    validationUserPayload: (payload) => {
        const resultValidation = userSchema.validate(payload);

        if(resultValidation.error){
            throw new InvariantError(resultValidation.error.message)
        }
    }
}
module.exports = validationResult;