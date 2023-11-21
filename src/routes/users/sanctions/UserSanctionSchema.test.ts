import { v4 as uuid } from 'uuid';
import { UserSanctionGetAllQuerySchema, UserSanctionCreateOneSchema } from './UserSanctionSchema';

describe('UserSanctionGetAllQuerySchema', () => {
  it('should validate with good data', async () => {
    expect.assertions(1);

    const data = {
      userId: uuid(),
      type: 'BAN',
      askCancellation: true,
      isCancelled: false,
      byUserId: uuid(),
      page: 1,
      limit: 10,
    };

    const { error } = UserSanctionGetAllQuerySchema.validate(data);

    expect(error).toBeUndefined();
  });

  it('should not validate with wrong data', async () => {
    expect.assertions(1);

    const data = {
      userId: 'wrong',
      type: 'wrong',
      askCancellation: 'wrong',
      isCancelled: 'wrong',
      byUserId: 'wrong',
      page: 'wrong',
      limit: 'wrong',
    };

    const { error } = UserSanctionGetAllQuerySchema.validate(data);

    expect(error).toBeDefined();
  });

  it('should valiate with missing data', async () => {
    expect.assertions(1);

    const data = {};

    const { error } = UserSanctionGetAllQuerySchema.validate(data);

    expect(error).toBeUndefined();
  });
});

describe('UserSanctionCreateOneSchema', () => {
  it('should validate with good data', async () => {
    expect.assertions(1);

    const data = {
      userId: uuid(),
      reason: 'reason',
      type: 'BAN',
    };

    const { error } = UserSanctionCreateOneSchema.validate(data);

    expect(error).toBeUndefined();
  });

  it('should not validate with wrong data', async () => {
    expect.assertions(1);

    const data = {
      userId: 'wrong',
      reason: 'reason',
      type: 'wrong',
    };

    const { error } = UserSanctionCreateOneSchema.validate(data);

    expect(error).toBeDefined();
  });

  it('should validate with missing data', async () => {
    expect.assertions(1);

    const data = {};

    const { error } = UserSanctionCreateOneSchema.validate(data);

    expect(error).toBeDefined();
  });
});
