import { UserSanctionGetAllQuerySchema, UserSanctionCreateOneSchema } from './UserSanctionSchema';

describe('UserSanctionGetAllQuerySchema', () => {
  it('should validate with good data', async () => {
    expect.assertions(1);

    const data = {
      type: 'BAN',
      askCancellation: true,
      isCancelled: false,
    };

    const { error } = UserSanctionGetAllQuerySchema.validate(data);

    expect(error).toBeUndefined();
  });

  it('should not validate with wrong data', async () => {
    expect.assertions(1);

    const data = {
      type: 'wrong',
      askCancellation: 'wrong',
      isCancelled: 'wrong',
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
      reason: 'reason',
      type: 'BAN',
    };

    const { error } = UserSanctionCreateOneSchema.validate(data);

    expect(error).toBeUndefined();
  });

  it('should not validate with wrong data', async () => {
    expect.assertions(1);

    const data = {
      reason: 'reason',
      type: 'wrong',
    };

    const { error } = UserSanctionCreateOneSchema.validate(data);

    expect(error).toBeDefined();
  });

  it('should not validate with missing data', async () => {
    expect.assertions(1);

    const data = {};

    const { error } = UserSanctionCreateOneSchema.validate(data);

    expect(error).toBeDefined();
  });
});
