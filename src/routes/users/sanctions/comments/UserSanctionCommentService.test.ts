import { UserModel, UserSanctionModel } from '../../../../models';
import { UserSanctionService } from '../UserSanctionService';

const userSanctionData = {
  userId: '1',
  reason: 'reason',
  type: 'BAN',
  expireAt: new Date(),
};

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

describe('createOne', () => {
  beforeEach(async () => {
    await UserModel.create(userData);
    await UserModel.create(userAdminData);
    await UserSanctionModel.create(userSanctionData);
  });

  afterEach(async () => {
    await UserSanctionModel.destroy({ where: {} });
    await UserModel.destroy({ where: {} });
  });

  it('should create one user sanction', async () => {
    expect.assertions(1);

    const userSanction = await UserSanctionService.createOne({
      userId: '1',
      reason: 'reason',
      type: 'BAN',
      expireAt: new Date(),
    });

    expect(userSanction).not.toBeNull();
  });
});
