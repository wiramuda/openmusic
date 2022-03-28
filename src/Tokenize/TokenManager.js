const jwt = require('@hapi/jwt');
const InvariantError = require('../exception/InvariantError');

const TokenManager = {
    generateAccessToken: (payload) => jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
    generateRefeshToken: (payload) => jwt.token.generate(payload,process.env.REFRESH_TOKEN_KEY),
    verifyRefreshToken: (refreshToken) => {
        try{
            const artifact = jwt.token.decode(refreshToken);
            jwt.token.verifySignature(artifact,process.env.REFRESH_TOKEN_KEY);
            const { payload } = artifact.decoded;
            return payload;
        }catch(error){
            throw new InvariantError('Refresh Token Tidak Valid!');
        }
    }
}

module.exports = TokenManager;