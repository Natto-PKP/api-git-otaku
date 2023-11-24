import supertest from 'supertest';

import { ApiLogModel, UserModel } from '../../../models';
import { server } from '../../../server';
import { AuthService } from '../../auth/AuthService';

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

const userSuperAdminData = {
  email: 'superadmin@domain.com',
  username: 'super_admin',
  password: '!lOv2ferret',
  pseudo: 'Super super admin',
  role: 'SUPER_ADMIN',
};

const logData = {
  type: 'INFO',
  status: 200,
  code: 'INTERNAL_SERVER_ERROR',
  message: 'This is a log',
};

const request = supertest(server);

describe('GET /api/logs', () => {
  it('should get all logs when the user is an admin', async () => {
    expect.assertions(3);

    const superAdmin = await UserModel.create(userSuperAdminData);
    const accessToken = await AuthService.generateJwtAccessToken(superAdmin);
    const refreshToken = await AuthService.generateJwtRefreshToken(superAdmin);

    const cookies = [
      `accessToken=${accessToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
      `refreshToken=${refreshToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
    ];

    const response = await request.get('/api/logs').set('Cookie', cookies);

    await superAdmin.destroy();

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

    const response = await request.get('/api/logs').set('Cookie', cookies);

    await user.destroy();

    expect(response.status).toBe(403);
  });

  it('should throw an error if the user is not authenticated', async () => {
    expect.assertions(1);

    const response = await request.get('/api/logs');

    expect(response.status).toBe(401);
  });
});

describe('GET /api/logs/:id', () => {
  it('should get a log when the user is an admin', async () => {
    expect.assertions(3);

    const superAdmin = await UserModel.create(userSuperAdminData);
    const accessToken = await AuthService.generateJwtAccessToken(superAdmin);
    const refreshToken = await AuthService.generateJwtRefreshToken(superAdmin);

    const log = await ApiLogModel.create(logData);

    const cookies = [
      `accessToken=${accessToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
      `refreshToken=${refreshToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
    ];

    const response = await request.get(`/api/logs/${log.id}`).set('Cookie', cookies);

    await superAdmin.destroy();
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

    const log = await ApiLogModel.create(logData);

    const cookies = [
      `accessToken=${accessToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
      `refreshToken=${refreshToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
    ];

    const response = await request.get(`/api/logs/${log.id}`).set('Cookie', cookies);

    await user.destroy();
    await log.destroy();

    expect(response.status).toBe(403);
  });

  it('should throw an error if the user is not authenticated', async () => {
    expect.assertions(1);

    const log = await ApiLogModel.create(logData);

    const response = await request.get(`/api/logs/${log.id}`);

    await log.destroy();

    expect(response.status).toBe(401);
  });
});

describe('DELETE /api/logs/:id', () => {
  it('should delete a log when the user is an admin', async () => {
    expect.assertions(2);

    const superAdmin = await UserModel.create(userSuperAdminData);
    const accessToken = await AuthService.generateJwtAccessToken(superAdmin);
    const refreshToken = await AuthService.generateJwtRefreshToken(superAdmin);

    const log = await ApiLogModel.create(logData);

    const cookies = [
      `accessToken=${accessToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
      `refreshToken=${refreshToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
    ];

    const response = await request.delete(`/api/logs/${log.id}`).set('Cookie', cookies);

    const deletedLog = await ApiLogModel.findByPk(log.id);

    await superAdmin.destroy();

    expect(response.status).toBe(204);
    expect(deletedLog).toBeNull();
  });

  it('should throw an error if the user do not have valid permissions even if he is a helper', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userHelperData);
    const accessToken = await AuthService.generateJwtAccessToken(user);
    const refreshToken = await AuthService.generateJwtRefreshToken(user);

    const log = await ApiLogModel.create(logData);

    const cookies = [
      `accessToken=${accessToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
      `refreshToken=${refreshToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()};`,
    ];

    const response = await request.delete(`/api/logs/${log.id}`).set('Cookie', cookies);

    await user.destroy();
    await log.destroy();

    expect(response.status).toBe(403);
  });

  it('should throw an error if the user do not have valid permissions', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const accessToken = await AuthService.generateJwtAccessToken(user);
    const refreshToken = await AuthService.generateJwtRefreshToken(user);

    const log = await ApiLogModel.create(logData);

    const cookies = [
      `accessToken=${accessToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()}`,
      `refreshToken=${refreshToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()}`,
    ];

    const response = await request.delete(`/api/logs/${log.id}`).set('Cookie', cookies);

    await user.destroy();
    await log.destroy();

    expect(response.status).toBe(403);
  });

  it('should throw an error if the user is not authenticated', async () => {
    expect.assertions(1);

    const log = await ApiLogModel.create(logData);

    const response = await request.delete(`/api/logs/${log.id}`);

    await log.destroy();

    expect(response.status).toBe(401);
  });
});
