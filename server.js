require('dotenv').config();
const Hapi = require('@hapi/hapi');
const jwt = require('@hapi/jwt');
const path = require('path');
const Inert = require('@hapi/inert');

// songs plugin module
const songs = require('./src/api/songs');
const SongsService = require('./src/services/postgres/SongServices');
const SongsValidator = require('./src/validator/songs');

// album plugin module
const album = require('./src/api/album');
const AlbumService = require('./src/services/postgres/AlbumService');
const AlbumValidator = require('./src/validator/album');

// users plugin module
const users = require('./src/services/users');
const UsersService = require('./src/services/postgres/UserService');
const UsersValidator = require('./src/validator/users');

// authentications plugin module
const authentications = require('./src/api/authentications');
const AuthenticationsService = require('./src/services/postgres/AuthenticationsService');
const TokenManager = require('./src/Tokenize/TokenManager');
const AuthenticationsValidator = require('./src/validator/authentications');

// playlist plugin module
const playlist = require('./src/api/playlist');
const PlaylistService = require('./src/services/postgres/PlaylistService');
const PlaylistValidator = require('./src/validator/playlist');

// collaboration plugin module
const collaboration = require('./src/api/colaborator');
const CollaborationService = require('./src/services/postgres/CollaborationService');
const collaborationValidator = require('./src/validator/collaboration');

// activity plugin module
const activity = require('./src/api/activities');
const ActivityService = require('./src/services/postgres/ActivityService');

// exports plugin module
const { ExportValidator } = require('./src/validator/exports');
const ProducerService = require('./src/services/rabbitmq/producerService');
const exportsApi = require('./src/api/exports');

// storage plugin module
const UploadImageService = require('./src/services/storage/uploadService');
const UploadValidator = require('./src/validator/upload');
const uploadImage = require('./src/api/upload');

// likes plugin module
const likes = require('./src/api/likes');
const LikesService = require('./src/services/postgres/LikesService');

// cache service
const CacheService = require('./src/services/redis/CacheService');

const ClientError = require('./src/exception/ClientError');

const init = async () => {
  const cacheService = new CacheService();
  const songsService = new SongsService();
  const albumService = new AlbumService();
  const usersService = new UsersService();
  const activityService = new ActivityService();
  const likesService = new LikesService(cacheService);
  const authenticationsService = new AuthenticationsService();
  const collaborationService = new CollaborationService();
  const playlistService = new PlaylistService(collaborationService);
  const uploadImageService = new UploadImageService(path.resolve(__dirname, 'src/api/upload/file/cover'));
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('songsapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => (
      { isValid: true, credentials: { id: artifacts.decoded.payload.id } }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authService: authenticationsService,
        userService: usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlist,
      options: {
        service: playlistService,
        songService: songsService,
        activityService,
        userService: usersService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: collaboration,
      options: {
        collaborationService,
        playlistService,
        usersService,
        validator: collaborationValidator,
      },
    },
    {
      plugin: activity,
      options: {
        activityService,
        playlistService,
        songsService,
      },
    },
    {
      plugin: exportsApi,
      options: {
        service: ProducerService,
        validator: ExportValidator,
        playlistService,
      },
    },
    {
      plugin: uploadImage,
      options: {
        service: uploadImageService,
        validator: UploadValidator,
        albumService,
      },
    },
    {
      plugin: likes,
      options: {
        service: likesService,
        albumService,
      },
    },

  ]);
  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof ClientError) {
      // membuat response baru dari response toolkit sesuai kebutuhan error handling
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return response.continue || response;
  });
  await server.start();
  console.log(`server berjalan pada ${server.info.uri}`);
};
init();
