import supertest from 'supertest';

import { UserModel, UserSanctionModel, UserSanctionCommentModel } from '../../../../models';
import { server } from '../../../../server';
import { AuthService } from '../../../auth/AuthService';

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

const userModeratorData = {
  email: 'moderator@domain.com',
  username: 'moderator',
  password: '!lOv2ferret',
  pseudo: 'Super mod',
  role: 'MODERATOR',
};

const userHelperData = {
  email: 'helper@domain.com',
  username: 'helper',
  password: '!lOv2ferret',
  pseudo: 'Super helper',
  role: 'HELPER',
};

const userSuperAdminData = {
  email: 'superadmin@domain.com',
  username: 'superadmin',
  password: '!lOv2ferret',
  pseudo: 'Super admin',
  role: 'ADMIN',
};

const userSanctionData = {
  reason: 'reason',
  type: 'BAN',
};

const userSanctionCommentData = {
  content: 'comment',
};

const request = supertest(server);

describe('GET /users/:userId/sanctions/:sanctionId/comments', () => {
  it('should get all user sanction comments', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });
    const admin = await UserModel.create(userAdminData);

    const accessToken = await AuthService.generateJwtAccessToken(admin);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request.get(`/users/${user.id}/sanctions/${sanction.id}/comments`).set('Cookie', cookies);

    expect(response.status).toBe(200);

    await user.destroy();
    await sanction.destroy();
    await admin.destroy();
  });

  it('should get all user sanction comments with pagination', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });
    const admin = await UserModel.create(userAdminData);

    const accessToken = await AuthService.generateJwtAccessToken(admin);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .get(`/users/${user.id}/sanctions/${sanction.id}/comments`)
      .query({ page: 1, limit: 10 })
      .set('Cookie', cookies);

    expect(response.status).toBe(200);

    await user.destroy();
    await sanction.destroy();
    await admin.destroy();
  });

  it('should get all user sanction comments with scope', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });
    const admin = await UserModel.create(userAdminData);

    const accessToken = await AuthService.generateJwtAccessToken(admin);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .get(`/users/${user.id}/sanctions/${sanction.id}/comments`)
      .query({ scope: 'internal' })
      .set('Cookie', cookies);

    expect(response.status).toBe(200);

    await user.destroy();
    await sanction.destroy();
    await admin.destroy();
  });

  it('should not get all user sanction comments if not authenticated', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const response = await request.get(`/users/${user.id}/sanctions/${sanction.id}/comments`);

    expect(response.status).toBe(401);

    await user.destroy();
    await sanction.destroy();
  });

  it('should not get all user sanction comments if not allowed', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });
    const user2 = await UserModel.create(userHelperData);

    const accessToken = await AuthService.generateJwtAccessToken(user2);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request.get(`/users/${user.id}/sanctions/${sanction.id}/comments`).set('Cookie', cookies);

    expect(response.status).toBe(403);

    await user.destroy();
    await sanction.destroy();
    await user2.destroy();
  });
});

describe('GET /users/:userId/sanctions/:sanctionId/comments/:commentId', () => {
  it('should get one user sanction comment', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });
    const admin = await UserModel.create(userAdminData);

    const comment = await UserSanctionCommentModel.create({
      ...userSanctionCommentData,
      sanctionId: sanction.id,
      senderId: admin.id,
    });

    const accessToken = await AuthService.generateJwtAccessToken(admin);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .get(`/users/${user.id}/sanctions/${sanction.id}/comments/${comment.id}`)
      .set('Cookie', cookies);

    expect(response.status).toBe(200);

    await user.destroy();
    await sanction.destroy();
    await comment.destroy();
    await admin.destroy();
  });

  it('should not get one user sanction comment if not allowed', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });
    const user2 = await UserModel.create(userHelperData);

    const comment = await UserSanctionCommentModel.create({
      ...userSanctionCommentData,
      sanctionId: sanction.id,
      senderId: user2.id,
    });

    const accessToken = await AuthService.generateJwtAccessToken(user2);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .get(`/users/${user.id}/sanctions/${sanction.id}/comments/${comment.id}`)
      .set('Cookie', cookies);

    expect(response.status).toBe(403);

    await user.destroy();
    await sanction.destroy();
    await comment.destroy();
    await user2.destroy();
  });

  it('should not get one user sanction comment in wrong sanction', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });
    const user2 = await UserModel.create(userAdminData);

    const comment = await UserSanctionCommentModel.create({
      ...userSanctionCommentData,
      sanctionId: sanction.id,
      senderId: user2.id,
    });

    const accessToken = await AuthService.generateJwtAccessToken(user2);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .get(`/users/${user.id}/sanctions/${sanction.id + 1}/comments/${comment.id}`)
      .set('Cookie', cookies);

    expect(response.status).toBe(404);

    await user.destroy();
    await sanction.destroy();
    await comment.destroy();
    await user2.destroy();
  });

  it('should not get one user sanction comment if not authenticated', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const response = await request.get(`/users/${user.id}/sanctions/${sanction.id}/comments/1`);

    expect(response.status).toBe(401);

    await user.destroy();
    await sanction.destroy();
  });
});

describe('POST /users/:userId/sanctions/:sanctionId/comments', () => {
  it('should create one user sanction comment', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });
    const admin = await UserModel.create(userAdminData);

    const accessToken = await AuthService.generateJwtAccessToken(admin);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .post(`/users/${user.id}/sanctions/${sanction.id}/comments`)
      .send(userSanctionCommentData)
      .set('Cookie', cookies);

    expect(response.status).toBe(204);

    await user.destroy();
    await sanction.destroy();
    await admin.destroy();
  });

  it('should not create one user sanction comment if not allowed', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const user2 = await UserModel.create(userHelperData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const accessToken = await AuthService.generateJwtAccessToken(user2);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .post(`/users/${user.id}/sanctions/${sanction.id}/comments`)
      .send(userSanctionCommentData)
      .set('Cookie', cookies);

    expect(response.status).toBe(403);

    await user.destroy();
    await sanction.destroy();
    await user2.destroy();
  });

  it('should not create one user sanction comment in wrong sanction', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const user2 = await UserModel.create(userAdminData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const accessToken = await AuthService.generateJwtAccessToken(user2);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .post(`/users/${user.id}/sanctions/${sanction.id + 1}/comments`)
      .send(userSanctionCommentData)
      .set('Cookie', cookies);

    expect(response.status).toBe(404);

    await user.destroy();
    await sanction.destroy();
    await user2.destroy();
  });

  it('should not create one user sanction comment if not authenticated', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const response = await request
      .post(`/users/${user.id}/sanctions/${sanction.id}/comments`)
      .send(userSanctionCommentData);

    expect(response.status).toBe(401);

    await user.destroy();
    await sanction.destroy();
  });
});

describe('PATCH /users/:userId/sanctions/:sanctionId/comments/:commentId', () => {
  it('should update one user sanction comment', async () => {
    expect.assertions(2);

    const user = await UserModel.create(userData);
    const user2 = await UserModel.create(userAdminData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const comment = await UserSanctionCommentModel.create({
      ...userSanctionCommentData,
      sanctionId: sanction.id,
      senderId: user2.id,
    });

    const accessToken = await AuthService.generateJwtAccessToken(user2);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .patch(`/users/${user.id}/sanctions/${sanction.id}/comments/${comment.id}`)
      .send({ content: 'new content' })
      .set('Cookie', cookies);

    const updatedComment = await UserSanctionCommentModel.findByPk(comment.id);

    expect(response.status).toBe(204);
    expect(updatedComment?.content).toBe('new content');
  });

  it('should not update one user sanction comment if not allowed', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const user2 = await UserModel.create(userHelperData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const comment = await UserSanctionCommentModel.create({
      ...userSanctionCommentData,
      sanctionId: sanction.id,
      senderId: user2.id,
    });

    const accessToken = await AuthService.generateJwtAccessToken(user2);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .patch(`/users/${user.id}/sanctions/${sanction.id}/comments/${comment.id}`)
      .send({ content: 'new content' })
      .set('Cookie', cookies);

    expect(response.status).toBe(403);

    await user.destroy();
    await sanction.destroy();
    await user2.destroy();
    await comment.destroy();
  });

  it('should not update one user sanction comment in wrong sanction', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const user2 = await UserModel.create(userAdminData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const comment = await UserSanctionCommentModel.create({
      ...userSanctionCommentData,
      sanctionId: sanction.id,
      senderId: user2.id,
    });

    const accessToken = await AuthService.generateJwtAccessToken(user2);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .patch(`/users/${user.id}/sanctions/${sanction.id + 1}/comments/${comment.id}`)
      .send({ content: 'new content' })
      .set('Cookie', cookies);

    expect(response.status).toBe(404);

    await user.destroy();
    await sanction.destroy();
    await user2.destroy();
    await comment.destroy();
  });

  it('should not update one user sanction comment if not authenticated', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });
    const comment = await UserSanctionCommentModel.create({
      ...userSanctionCommentData,
      sanctionId: sanction.id,
      senderId: user.id,
    });

    const response = await request
      .patch(`/users/${user.id}/sanctions/${sanction.id}/comments/${comment.id}`)
      .send({ content: 'new content' });

    expect(response.status).toBe(401);

    await user.destroy();
    await sanction.destroy();
    await comment.destroy();
  });

  it('should not update other user sanction comment if not allowed', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const user2 = await UserModel.create(userSuperAdminData);
    const user3 = await UserModel.create(userAdminData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const comment = await UserSanctionCommentModel.create({
      ...userSanctionCommentData,
      sanctionId: sanction.id,
      senderId: user2.id,
    });

    const accessToken = await AuthService.generateJwtAccessToken(user3);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .patch(`/users/${user.id}/sanctions/${sanction.id}/comments/${comment.id}`)
      .send({ content: 'new content' })
      .set('Cookie', cookies);

    expect(response.status).toBe(403);

    await user.destroy();
    await sanction.destroy();
    await user2.destroy();
    await user3.destroy();
    await comment.destroy();
  });
});

describe('DELETE /users/:userId/sanctions/:sanctionId/comments/:commentId', () => {
  it('should delete one user sanction comment', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const user2 = await UserModel.create(userAdminData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const comment = await UserSanctionCommentModel.create({
      ...userSanctionCommentData,
      sanctionId: sanction.id,
      senderId: user2.id,
    });

    const accessToken = await AuthService.generateJwtAccessToken(user2);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .delete(`/users/${user.id}/sanctions/${sanction.id}/comments/${comment.id}`)
      .set('Cookie', cookies);

    expect(response.status).toBe(204);

    await user.destroy();
    await sanction.destroy();
    await user2.destroy();
  });

  it('should not delete one user sanction comment if not allowed', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const user2 = await UserModel.create(userHelperData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const comment = await UserSanctionCommentModel.create({
      ...userSanctionCommentData,
      sanctionId: sanction.id,
      senderId: user2.id,
    });

    const accessToken = await AuthService.generateJwtAccessToken(user2);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .delete(`/users/${user.id}/sanctions/${sanction.id}/comments/${comment.id}`)
      .set('Cookie', cookies);

    expect(response.status).toBe(403);

    await user.destroy();
    await sanction.destroy();
    await user2.destroy();
    await comment.destroy();
  });

  it('should not delete one user sanction comment in wrong sanction', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const user2 = await UserModel.create(userAdminData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const comment = await UserSanctionCommentModel.create({
      ...userSanctionCommentData,
      sanctionId: sanction.id,
      senderId: user2.id,
    });

    const accessToken = await AuthService.generateJwtAccessToken(user2);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .delete(`/users/${user.id}/sanctions/${sanction.id + 1}/comments/${comment.id}`)
      .set('Cookie', cookies);

    expect(response.status).toBe(404);

    await user.destroy();
    await sanction.destroy();
    await user2.destroy();
    await comment.destroy();
  });

  it('should not delete one user sanction comment if not authenticated', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });
    const comment = await UserSanctionCommentModel.create({
      ...userSanctionCommentData,
      sanctionId: sanction.id,
      senderId: user.id,
    });

    const response = await request.delete(`/users/${user.id}/sanctions/${sanction.id}/comments/${comment.id}`);

    expect(response.status).toBe(401);

    await user.destroy();
    await sanction.destroy();
    await comment.destroy();
  });

  it('should not delete other user sanction comment if not allowed', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const user2 = await UserModel.create(userSuperAdminData);
    const user3 = await UserModel.create(userModeratorData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const comment = await UserSanctionCommentModel.create({
      ...userSanctionCommentData,
      sanctionId: sanction.id,
      senderId: user2.id,
    });

    const accessToken = await AuthService.generateJwtAccessToken(user3);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .delete(`/users/${user.id}/sanctions/${sanction.id}/comments/${comment.id}`)
      .set('Cookie', cookies);

    expect(response.status).toBe(403);

    await user.destroy();
    await sanction.destroy();
    await user2.destroy();
    await user3.destroy();
    await comment.destroy();
  });

  it('should delete user sanction comment if allowed', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const user2 = await UserModel.create(userModeratorData);
    const user3 = await UserModel.create(userSuperAdminData);
    const sanction = await UserSanctionModel.create({ ...userSanctionData, userId: user.id });

    const comment = await UserSanctionCommentModel.create({
      ...userSanctionCommentData,
      sanctionId: sanction.id,
      senderId: user2.id,
    });

    const accessToken = await AuthService.generateJwtAccessToken(user3);
    const cookies = [`accessToken=${accessToken}`];

    const response = await request
      .delete(`/users/${user.id}/sanctions/${sanction.id}/comments/${comment.id}`)
      .set('Cookie', cookies);

    expect(response.status).toBe(204);

    await user.destroy();
    await sanction.destroy();
    await user2.destroy();
    await user3.destroy();
  });
});
