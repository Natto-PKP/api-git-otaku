import { UserModel } from '../../models';
import { UserService } from './UserService';

const userData = {
  email: 'user@domain.com',
  username: 'user',
  password: '!lOv2ferret',
  pseudo: 'Super user',
};

describe('createOne', () => {
  it('should create a new user', async () => {
    expect.assertions(1);

    const user = await UserService.createOne(userData);

    expect(user).toBeDefined();

    await user.destroy();
  });

  it('should not create a new user with wrong email', async () => {
    expect.assertions(1);

    const wrongUserData = {
      ...userData,
      email: 'wrong_email',
    };

    try {
      await UserService.createOne(wrongUserData);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should not create a new user with wrong username', async () => {
    expect.assertions(1);

    const wrongUserData = {
      ...userData,
      username: 'wrong_',
    };

    try {
      await UserService.createOne(wrongUserData);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should not create a new user with wrong pseudo', async () => {
    expect.assertions(1);

    const wrongUserData = {
      ...userData,
      pseudo: 'wrong_ ',
    };

    try {
      await UserService.createOne(wrongUserData);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should not create user with same username', async () => {
    expect.assertions(1);

    const user = await UserService.createOne(userData);

    try {
      await UserService.createOne(userData);
    } catch (error) {
      expect(error).toBeDefined();
    }

    await user.destroy();
  });

  it('should not create user with same email', async () => {
    expect.assertions(1);

    const user = await UserService.createOne(userData);

    try {
      await UserService.createOne(userData);
    } catch (error) {
      expect(error).toBeDefined();
    }

    await user.destroy();
  });
});

describe('getAll', () => {
  it('should get all users', async () => {
    expect.assertions(1);

    const users = await UserService.getAll({ page: 1, limit: 10, offset: 0 }, {});

    expect(users.data).toBeDefined();
  });

  it('should get all users with query', async () => {
    expect.assertions(1);

    const users = await UserService.getAll({ page: 1, limit: 10, offset: 0 }, { search: 'user' });

    expect(users.data).toBeDefined();
  });

  it('should get all users with query and pagination', async () => {
    expect.assertions(1);

    const users = await UserService.getAll({ page: 1, limit: 10, offset: 0 }, { search: 'user' });

    expect(users.data).toBeDefined();
  });
});

describe('getOne', () => {
  it('should get one user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const userFound = await UserService.getOne(user.id);

    expect(userFound).toBeDefined();

    await user.destroy();
  });

  it('should get one user with private scope', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    const userFound = await UserService.getOne(user.id, { scope: 'private' });

    expect(userFound).toBeDefined();

    await user.destroy();
  });
});

describe('updateOne', () => {
  it('should update a user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    await UserService.updateOne(user.id, { pseudo: 'New pseudo' });
    const userUpdated = await UserService.getOne(user.id);

    expect(userUpdated?.pseudo).toBe('New pseudo');

    await user.destroy();
  });
});

describe('deleteOne', () => {
  it('should delete a user', async () => {
    expect.assertions(1);

    const user = await UserModel.create(userData);

    await UserService.deleteOne(user.id);
    const userFound = await UserService.getOne(user.id);

    expect(userFound).toBeNull();
  });
});
