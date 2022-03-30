/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exception/ClientError');
const ServerError = require('../../exception/ServerError');

class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // class method
    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      await this._validator.validationUserPayload(request.payload);
      const { username, password, fullname } = request.payload;

      const userId = await this._service.addUser({ username, password, fullname });
      const response = h.response({
        status: 'success',
        messahe: 'user berhasil ditambahkan',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response(error.toString()).code(error.statusCode);
      }
      // server error
      console.log(error);
      return h.response(new ServerError('server sedanng error').toString())
        .code(500);
    }
  }

  async getUserByIdHandler(request, h) {
    try {
      const { userId } = request.params;
      const user = await this._service.getUserById(userId);
      return h.response({
        status: 'success',
        data: {
          user,
        },
      }).code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response(error.toString()).code(error.statusCode);
      }
      // server error
      console.log(error);
      return h.response(new ServerError('server sedanng error').toString())
        .code(500);
    }
  }
}

module.exports = UserHandler;
