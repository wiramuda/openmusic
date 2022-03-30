const InvariantError = require('../../exception/InvariantError');
const { PlaylistPayloadSchema, PlaylistAddSongSchema } = require('./schema');

const PlaylistValidator = {
  validatePlaylistPayload: (payload) => {
    const validateResult = PlaylistPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
  validatePlaylistSongIdPayload: (payload) => {
    const validateResult = PlaylistAddSongSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
