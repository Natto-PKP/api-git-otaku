import supertest from 'supertest';

import { LogModel, UserModel } from '../../models';
import { server } from '../../server';
import { AuthService } from '../auth/AuthService';

const userData = {
  email: 'user@domain.com',
  username: 'user',
  password: '!lOv2ferret',
  pseudo: 'Super user',
};

const userHelperData = {
  email: 'helper@domain.com',
  username: 'helper',
  password: '!lOv2ferret',
  pseudo: 'Super helper',
  role: 'HELPER',
};

const userAdminData = {
  email: 'admin@domain.com',
  username: 'admin',
  password: '!lOv2ferret',
  pseudo: 'Super admin',
  role: 'ADMIN',
};

const logData = {
  type: 'INFO',
  status: 200,
  code: 'A_LOG',
  message: 'This is a log',
};

const request = supertest(server);

describe('GET /logs', () => {
  it('should get all logs when the user is an admin', async () => {
    expect.assertions(3);

    const user = await UserModel.create(userAdminData);
    const accessToken = await AuthService.generateJwtAccessToken(user);
    const refreshToken = await AuthService.generateJwtRefreshToken(user);

    const cookies = [
      `accessToken=${accessToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
      `refreshToken=${refreshToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
    ];

    const response = await request.get('/logs').set('Cookie', cookies);

    await user.destroy();

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });

  it('should throw an error if the user do not have valid permissions', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const accessToken = await AuthService.generateJwtAccessToken(user);
    const refreshToken = await AuthService.generateJwtRefreshToken(user);

    const cookies = [
      `accessToken=${accessToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
      `refreshToken=${refreshToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
    ];

    const response = await request.get('/logs').set('Cookie', cookies);

    await user.destroy();

    expect(response.status).toBe(403);
  });

  it('should throw an error if the user is not authenticated', async () => {
    expect.assertions(1);

    const response = await request.get('/logs');

    expect(response.status).toBe(401);
  });
});

describe('GET /logs/:id', () => {
  it('should get a log when the user is an admin', async () => {
    expect.assertions(3);

    const user = await UserModel.create(userAdminData);
    const accessToken = await AuthService.generateJwtAccessToken(user);
    const refreshToken = await AuthService.generateJwtRefreshToken(user);

    const log = await LogModel.create(logData);

    const cookies = [
      `accessToken=${accessToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
      `refreshToken=${refreshToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
    ];

    const response = await request.get(`/logs/${log.id}`).set('Cookie', cookies);

    await user.destroy();
    await log.destroy();

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(log.id);
  });

  it('should throw an error if the user do not have valid permissions', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const accessToken = await AuthService.generateJwtAccessToken(user);
    const refreshToken = await AuthService.generateJwtRefreshToken(user);

    const log = await LogModel.create(logData);

    const cookies = [
      `accessToken=${accessToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
      `refreshToken=${refreshToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
    ];

    const response = await request.get(`/logs/${log.id}`).set('Cookie', cookies);

    await user.destroy();
    await log.destroy();

    expect(response.status).toBe(403);
  });

  it('should throw an error if the user is not authenticated', async () => {
    expect.assertions(1);

    const log = await LogModel.create(logData);

    const response = await request.get(`/logs/${log.id}`);

    await log.destroy();

    expect(response.status).toBe(401);
  });
});

describe('DELETE /logs/:id', () => {
  it('should delete a log when the user is an admin', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userAdminData);
    const accessToken = await AuthService.generateJwtAccessToken(user);
    const refreshToken = await AuthService.generateJwtRefreshToken(user);

    const log = await LogModel.create(logData);

    const cookies = [
      `accessToken=${accessToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
      `refreshToken=${refreshToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
    ];

    await request.delete(`/logs/${log.id}`).set('Cookie', cookies);

    const deletedLog = await LogModel.findByPk(log.id);

    await user.destroy();

    expect(deletedLog).toBeNull();
  });

  it('should throw an error if the user do not have valid permissions even if he is a helper', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userHelperData);
    const accessToken = await AuthService.generateJwtAccessToken(user);
    const refreshToken = await AuthService.generateJwtRefreshToken(user);

    const log = await LogModel.create(logData);

    const cookies = [
      `accessToken=${accessToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
      `refreshToken=${refreshToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
    ];

    const response = await request.delete(`/logs/${log.id}`).set('Cookie', cookies);

    await user.destroy();
    await log.destroy();

    expect(response.status).toBe(403);
  });

  it('should throw an error if the user do not have valid permissions', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const accessToken = await AuthService.generateJwtAccessToken(user);
    const refreshToken = await AuthService.generateJwtRefreshToken(user);

    const log = await LogModel.create(logData);

    const cookies = [
      `accessToken=${accessToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()}`,
      `refreshToken=${refreshToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()}`,
    ];

    const response = await request.delete(`/logs/${log.id}`).set('Cookie', cookies);

    await user.destroy();
    await log.destroy();

    expect(response.status).toBe(403);
  });

  it('should throw an error if the user is not authenticated', async () => {
    expect.assertions(1);

    const log = await LogModel.create(logData);

    const response = await request.delete(`/logs/${log.id}`);

    await log.destroy();

    expect(response.status).toBe(401);
  });
});
