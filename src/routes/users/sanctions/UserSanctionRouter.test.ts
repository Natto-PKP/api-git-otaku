import supertest from 'supertest';

import { IUserSanctionModel, UserModel, UserSanctionModel } from '../../../models';
import { server } from '../../../server';
import { AuthService } from '../../auth/AuthService';

const userData = {
  email: 'user@domain.com',
  username: 'user',
  password: '!lOv2ferret',
  pseudo: 'Super user',
};

const userAdminData = {
  email: 'admin@domain.com',
  username: 'admin',
  password: '!lOv2ferret',
  pseudo: 'Super admin',
  role: 'ADMIN',
};
const userHelperData = {
  email: 'helper@domain.com',
  username: 'helper',
  password: '!lOv2ferret',
  pseudo: 'Super helper',
  role: 'HELPER',
};

const userSanctionData: Partial<IUserSanctionModel> = {
  reason: 'reason',
  type: 'BAN',
};

const request = supertest(server);

describe('GET /users/:userId/sanctions', () => {
  it('should get all user sanctions', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const admin = await UserModel.create(userAdminData);

    const accessToken = await AuthService.generateJwtAccessToken(admin);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request.get(`/users/${user.id}/sanctions`).set('Cookie', cookies);

    expect(response.status).toBe(200);

    await user.destroy();
    await admin.destroy();
  });

  it('should get all user sanctions with query', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const admin = await UserModel.create(userAdminData);

    const accessToken = await AuthService.generateJwtAccessToken(admin);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request.get(`/users/${user.id}/sanctions?type=BAN`).set('Cookie', cookies);

    expect(response.status).toBe(200);

    await user.destroy();
    await admin.destroy();
  });

  it('should get all user sanctions with query and pagination', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const admin = await UserModel.create(userAdminData);

    const accessToken = await AuthService.generateJwtAccessToken(admin);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request.get(`/users/${user.id}/sanctions?type=BAN&page=1&limit=10`).set('Cookie', cookies);

    expect(response.status).toBe(200);

    await user.destroy();
    await admin.destroy();
  });

  it('should not get all user sanctions with unauthenticated user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const response = await request.get(`/users/${user.id}/sanctions`);

    expect(response.status).toBe(401);

    await user.destroy();
  });

  it('should get all current user sanctions with authenticated user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const accessToken = await AuthService.generateJwtAccessToken(user);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request.get(`/users/${user.id}/sanctions`).set('Cookie', cookies);

    expect(response.status).toBe(200);

    await user.destroy();
  });

  it('should not get all user sanctions with non admin user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const user2 = await UserModel.create(userHelperData);

    const accessToken = await AuthService.generateJwtAccessToken(user);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request.get(`/users/${user2.id}/sanctions`).set('Cookie', cookies);

    expect(response.status).toBe(403);

    await user.destroy();
    await user2.destroy();
  });
});

describe('GET /users/:userId/sanctions/:sanctionId', () => {
  it('should get a user sanction', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const admin = await UserModel.create(userAdminData);
    const userSanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const accessToken = await AuthService.generateJwtAccessToken(admin);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request.get(`/users/${user.id}/sanctions/${userSanction.id}`).set('Cookie', cookies);

    expect(response.status).toBe(200);

    await userSanction.destroy();
    await user.destroy();
    await admin.destroy();
  });

  it('should not get a user sanction with unauthenticated user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const userSanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const response = await request.get(`/users/${user.id}/sanctions/${userSanction.id}`);

    expect(response.status).toBe(401);

    await userSanction.destroy();
    await user.destroy();
  });

  it('should not get a user sanction with non admin user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const anotherUser = await UserModel.create(userHelperData);
    const userSanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const accessToken = await AuthService.generateJwtAccessToken(anotherUser);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request.get(`/users/${user.id}/sanctions/${userSanction.id}`).set('Cookie', cookies);

    expect(response.status).toBe(403);

    await userSanction.destroy();
    await user.destroy();
    await anotherUser.destroy();
  });
});

describe('POST /users/:userId/sanctions', () => {
  it('should create a user sanction', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const admin = await UserModel.create(userAdminData);

    const accessToken = await AuthService.generateJwtAccessToken(admin);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .post(`/users/${user.id}/sanctions`)
      .set('Cookie', cookies)
      .send({ ...userSanctionData });

    expect(response.status).toBe(204);

    await UserSanctionModel.destroy({ where: { userId: user.id } });
    await admin.destroy();
    await user.destroy();
  });

  it('should not create a user sanction with unauthenticated user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const response = await request.post(`/users/${user.id}/sanctions`).send({ ...userSanctionData });

    expect(response.status).toBe(401);

    await user.destroy();
  });

  it('should not create a user sanction with non admin user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const accessToken = await AuthService.generateJwtAccessToken(user);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .post(`/users/${user.id}/sanctions`)
      .set('Cookie', cookies)
      .send({ ...userSanctionData });

    expect(response.status).toBe(403);

    await user.destroy();
  });

  it('should not create a user sanction for an admin user', async () => {
    expect.assertions(1);

    const admin = await UserModel.create(userAdminData);
    const user = await UserModel.create(userData);

    const accessToken = await AuthService.generateJwtAccessToken(admin);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .post(`/users/${admin.id}/sanctions`)
      .set('Cookie', cookies)
      .send({ ...userSanctionData });

    expect(response.status).toBe(403);

    await admin.destroy();
    await user.destroy();
  });
});

describe('DELETE /users/:userId/sanctions/:sanctionId', () => {
  it('should cancel a user sanction', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const admin = await UserModel.create(userAdminData);
    const userSanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const accessToken = await AuthService.generateJwtAccessToken(admin);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request.delete(`/users/${user.id}/sanctions/${userSanction.id}`).set('Cookie', cookies);

    expect(response.status).toBe(204);

    await userSanction.destroy();
    await user.destroy();
    await admin.destroy();
  });

  it('should not cancel a user sanction with unauthenticated user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const userSanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const response = await request.delete(`/users/${user.id}/sanctions/${userSanction.id}`);

    expect(response.status).toBe(401);

    await userSanction.destroy();
    await user.destroy();
  });

  it('should not cancel a user sanction with non admin user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const userSanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const accessToken = await AuthService.generateJwtAccessToken(user);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request.delete(`/users/${user.id}/sanctions/${userSanction.id}`).set('Cookie', cookies);

    expect(response.status).toBe(403);

    await userSanction.destroy();
    await user.destroy();
  });
});
