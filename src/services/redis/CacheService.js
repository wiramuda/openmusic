const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: 'localhost',
      },
    });
    this._client.on('error', (e) => {
      console.log(e);
    });
    this._client.connect();
  }

  async set(key, value, expirationInSecond = 1800 ) { // for 30 minute
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);
    if (result == null) return null;

    return result;
  }

  async delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
