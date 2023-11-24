import { IUserSanctionModel, UserModel } from '../../../models';
import { UserSanctionService } from './UserSanctionService';

const userSanctionData: Partial<IUserSanctionModel> = {
  userId: '1',
  reason: 'reason',
  type: 'BAN',
  expireAt: new Date(),
  byUserId: null,
  askCancellation: false,
  cancellationReason: null,
  isCancelled: false,
  cancelledAt: null,
  cancelledByUserId: null,
  cancelledReason: null,
};

const userData = {
  email: 'user@domain.com',
  username: 'user',
  password: '!lOv2ferret',
  pseudo: 'Super user',
};

describe('createOne', () => {
  it('should create a new user sanction', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const userSanction = await UserSanctionService.createOne({ ...userSanctionData, userId: user.id });

    expect(userSanction).toBeDefined();

    await userSanction.destroy();
    await user.destroy();
  });

  it('should not create a new user sanction with wrong type', async () => {
    expect.assertions(1);

    const wrongUserSanctionData = {
      ...userSanctionData,
      type: 'wrong' as unknown,
    } as Partial<IUserSanctionModel>;

    try {
      await UserSanctionService.createOne(wrongUserSanctionData);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should not create a new user sanction with wrong expireAt', async () => {
    expect.assertions(1);

    const wrongUserSanctionData = {
      ...userSanctionData,
      expireAt: 'wrong' as unknown,
    } as Partial<IUserSanctionModel>;

    try {
      await UserSanctionService.createOne(wrongUserSanctionData);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe('getAll', () => {
  it('should get all user sanctions', async () => {
    expect.assertions(2);

    const sanctions = await UserSanctionService.getAll({ page: 1, limit: 10, offset: 0 }, {}, { count: true });

    expect(sanctions.data).toBeDefined();
    expect(Array.isArray(sanctions.data)).toBe(true);
  });

  it('should get all user sanctions with query', async () => {
    expect.assertions(2);

    const sanctions = await UserSanctionService.getAll(
      { page: 1, limit: 10, offset: 0 },
      { userId: '1', type: 'BAN', askCancellation: false, isCancelled: false, byUserId: null },
      { count: true },
    );

    expect(sanctions.data).toBeDefined();
    expect(Array.isArray(sanctions.data)).toBe(true);
  });

  it('should get all user sanctions with query and scope', async () => {
    expect.assertions(2);

    const sanctions = await UserSanctionService.getAll(
      { page: 1, limit: 10, offset: 0 },
      { userId: '1', type: 'BAN', askCancellation: false, isCancelled: false, byUserId: null },
      { count: true, scope: 'private' },
    );

    expect(sanctions.data).toBeDefined();
    expect(Array.isArray(sanctions.data)).toBe(true);
  });
});

describe('getOne', () => {
  it('should get one user sanction', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const userSanction = await UserSanctionService.createOne({ ...userSanctionData, userId: user.id });
    const sanction = await UserSanctionService.getOne(userSanction.id);

    expect(sanction).toBeDefined();

    await userSanction.destroy();
    await user.destroy();
  });

  it('should not get one user sanction with wrong id', async () => {
    expect.assertions(1);

    const sanction = await UserSanctionService.getOne('wrong');

    expect(sanction).toBeNull();
  });

  it('should not get one user sanction with wrong id and scope', async () => {
    expect.assertions(1);

    const sanction = await UserSanctionService.getOne('wrong', { scope: 'private' });

    expect(sanction).toBeNull();
  });

  it('should get one user sanction with scope', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const userSanction = await UserSanctionService.createOne({ ...userSanctionData, userId: user.id });
    const sanction = await UserSanctionService.getOne(userSanction.id, { scope: 'private' });

    expect(sanction).toBeDefined();

    await userSanction.destroy();
    await user.destroy();
  });
});

describe('deleteOne', () => {
  it('should delete one user sanction', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const userSanction = await UserSanctionService.createOne({ ...userSanctionData, userId: user.id });

    await UserSanctionService.deleteOne(userSanction.id);
    const sanction = await UserSanctionService.getOne(userSanction.id);

    expect(sanction).toBeNull();

    await user.destroy();
  });
});

describe('updateOne', () => {
  it('should update one user sanction', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);
    const userSanction = await UserSanctionService.createOne({ ...userSanctionData, userId: user.id });

    await UserSanctionService.updateOne(userSanction.id, { reason: 'New reason' });
    const sanction = await UserSanctionService.getOne(userSanction.id);

    expect(sanction?.reason).toBe('New reason');

    await userSanction.destroy();
    await user.destroy();
  });
});

describe('cancelOne', () => {
  it('should cancel one user sanction', async () => {
    expect.assertions(4);

    const user = await UserModel.create(userData);
    const userSanction = await UserSanctionService.createOne({ ...userSanctionData, userId: user.id });

    await UserSanctionService.cancelOne(userSanction.id, { cancelledReason: 'New reason', cancelledByUserId: user.id });
    const sanction = await UserSanctionService.getOne(userSanction.id, { scope: 'system' });

    expect(sanction?.isCancelled).toBe(true);
    expect(sanction?.cancelledAt).not.toBeNull();
    expect(sanction?.cancelledReason).toBe('New reason');
    expect(sanction?.cancelledByUserId).toBe(user.id);

    await userSanction.destroy();
    await user.destroy();
  });
});
