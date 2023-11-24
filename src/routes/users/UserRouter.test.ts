import supertest from 'supertest';

import { UserModel } from '../../models';
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

const request = supertest(server);

describe('GET /users', () => {
  it('should get all users', async () => {
    expect.assertions(1);

    const response = await request.get('/users');

    expect(response.status).toBe(200);
  });

  it('should get all users with query', async () => {
    expect.assertions(1);

    const response = await request.get('/users?search=user');

    expect(response.status).toBe(200);
  });

  it('should get all users with query and pagination', async () => {
    expect.assertions(1);

    const response = await request.get('/users?search=user&page=1&limit=10');

    expect(response.status).toBe(200);
  });

  it('should not get all users with role query if authenticated user is not allowed', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const token = await AuthService.generateJwtAccessToken(user);

    const cookies = [
      `accessToken=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}; SameSite=Lax`,
    ];

    const response = await request.get('/users?role=ADMIN').set('Cookie', cookies);

    await user.destroy();

    expect(response.status).toBe(403);
  });

  it('should get all users with authenticated user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const token = await AuthService.generateJwtAccessToken(user);

    const cookies = [
      `accessToken=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}; SameSite=Lax`,
    ];

    const response = await request.get('/users').set('Cookie', cookies);

    await user.destroy();

    expect(response.status).toBe(200);
  });
});

describe('GET /users/:identifier', () => {
  it('should get a user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const response = await request.get(`/users/${user.id}`);

    await user.destroy();

    expect(response.status).toBe(200);
  });

  it('should get a user with username', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const response = await request.get(`/users/${user.username}`);

    await user.destroy();

    expect(response.status).toBe(200);
  });

  it('should get a user with authenticated user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const token = await AuthService.generateJwtAccessToken(user);

    const cookies = [
      `accessToken=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}; SameSite=Lax`,
    ];

    const response = await request.get(`/users/${user.id}`).set('Cookie', cookies);

    await user.destroy();

    expect(response.status).toBe(200);
  });

  it('should get current user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const token = await AuthService.generateJwtAccessToken(user);

    const cookies = [
      `accessToken=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}; SameSite=Lax`,
    ];

    const response = await request.get(`/users/@me`).set('Cookie', cookies);

    await user.destroy();

    expect(response.status).toBe(200);
  });

  it('should not get a user', async () => {
    expect.assertions(1);

    const response = await request.get(`/users/invalid-id`);

    expect(response.status).toBe(404);
  });
});

describe('DELETE /users/:userId', () => {
  it('should not delete a user with admin', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const admin = await UserModel.create(userAdminData);

    const token = await AuthService.generateJwtAccessToken(admin);

    const cookies = [
      `accessToken=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}; SameSite=Lax`,
    ];

    const response = await request.delete(`/users/${user.id}`).set('Cookie', cookies);

    await user.destroy();
    await admin.destroy();

    expect(response.status).toBe(403);
  });

  it('should not delete a user with helper', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const helper = await UserModel.create(userHelperData);

    const token = await AuthService.generateJwtAccessToken(helper);

    const cookies = [
      `accessToken=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}; SameSite=Lax`,
    ];

    const response = await request.delete(`/users/${user.id}`).set('Cookie', cookies);

    await user.destroy();
    await helper.destroy();

    expect(response.status).toBe(403);
  });

  it('should delete a user with self', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const token = await AuthService.generateJwtAccessToken(user);

    const cookies = [
      `accessToken=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}; SameSite=Lax`,
    ];

    const response = await request.delete(`/users/${user.id}`).set('Cookie', cookies);

    await user.destroy();

    expect(response.status).toBe(204);
  });

  it('should not delete a user if not self', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const user2 = await UserModel.create(userAdminData);

    const token = await AuthService.generateJwtAccessToken(user);

    const cookies = [
      `accessToken=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}; SameSite=Lax`,
    ];

    const response = await request.delete(`/users/${user2.id}`).set('Cookie', cookies);

    await user.destroy();
    await user2.destroy();

    expect(response.status).toBe(403);
  });

  it('should not delete a user with invalid id', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userAdminData);

    const token = await AuthService.generateJwtAccessToken(user);

    const cookies = [
      `accessToken=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}; SameSite=Lax`,
    ];

    const response = await request.delete(`/users/invalid-id`).set('Cookie', cookies);

    await user.destroy();

    expect(response.status).toBe(403);
  });
});

describe('PATCH /users/:userId', () => {
  it('should update a user with admin', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const admin = await UserModel.create(userAdminData);

    const token = await AuthService.generateJwtAccessToken(admin);

    const cookies = [
      `accessToken=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}; SameSite=Lax`,
    ];

    const data = {
      pseudo: 'Updated user',
    };

    const response = await request.patch(`/users/${user.id}`).send(data).set('Cookie', cookies);

    await user.destroy();
    await admin.destroy();

    expect(response.status).toBe(200);
  });

  it('should not update a user with helper', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const helper = await UserModel.create(userHelperData);

    const token = await AuthService.generateJwtAccessToken(helper);

    const cookies = [
      `accessToken=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}; SameSite=Lax`,
    ];

    const data = {
      pseudo: 'Updated user',
    };

    const response = await request.patch(`/users/${user.id}`).send(data).set('Cookie', cookies);

    await user.destroy();
    await helper.destroy();

    expect(response.status).toBe(403);
  });

  it('should update a user with self', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const token = await AuthService.generateJwtAccessToken(user);

    const cookies = [
      `accessToken=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}; SameSite=Lax`,
    ];

    const data = {
      pseudo: 'Updated user',
    };

    const response = await request.patch(`/users/${user.id}`).send(data).set('Cookie', cookies);

    await user.destroy();

    expect(response.status).toBe(200);
  });

  it('should not update a user if not self', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const user2 = await UserModel.create(userAdminData);

    const token = await AuthService.generateJwtAccessToken(user);

    const cookies = [
      `accessToken=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}; SameSite=Lax`,
    ];
    const data = {
      pseudo: 'Updated user',
    };

    const response = await request.patch(`/users/${user2.id}`).send(data).set('Cookie', cookies);

    await user.destroy();
    await user2.destroy();

    expect(response.status).toBe(403);
  });
});
