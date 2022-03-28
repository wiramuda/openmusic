const { CollaborationPayloadSchema } = require("./schema");
const InvarioantError = require('../../exception/InvariantError');
const validateCollaborationPayload = {
    validateCollaboration: (payload) => {
        const validationResult = CollaborationPayloadSchema.validate(payload);
        if(validationResult.error){
            return new InvarioantError(validationResult.error.message);
        }
    }
};

module.exports = validateCollaborationPayload;
