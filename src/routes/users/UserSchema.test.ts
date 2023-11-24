import { UserGetAllQuerySchema, UserUpdateBodySchema } from './UserSchema';

describe('UserGetAllQuerySchema', () => {
  it('should validate a valid query', async () => {
    expect.assertions(1);

    const { error } = UserGetAllQuerySchema.validate({
      role: 'ADMIN',
      isVerified: true,
      search: 'search',
    });

    expect(error).toBeUndefined();
  });

  it('should validate a valid query with no optional fields', async () => {
    expect.assertions(1);

    const { error } = UserGetAllQuerySchema.validate({});

    expect(error).toBeUndefined();
  });

  it('should not validate a query with wrong role', async () => {
    expect.assertions(1);

    const { error } = UserGetAllQuerySchema.validate({
      role: 'WRONG_ROLE',
      isVerified: true,
      search: 'search',
    });

    expect(error).toBeDefined();
  });

  it('should not validate a query with wrong isVerified', async () => {
    expect.assertions(1);

    const { error } = UserGetAllQuerySchema.validate({
      role: 'ADMIN',
      isVerified: 'wrong_isVerified',
      search: 'search',
    });

    expect(error).toBeDefined();
  });

  it('should not validate a query with wrong search', async () => {
    expect.assertions(1);

    const { error } = UserGetAllQuerySchema.validate({
      role: 'ADMIN',
      isVerified: true,
      search: 1,
    });

    expect(error).toBeDefined();
  });

  it('should not validate a query with wrong fields', async () => {
    expect.assertions(1);

    const { error } = UserGetAllQuerySchema.validate({
      wrongField: 'wrongField',
    });

    expect(error).toBeDefined();
  });
});

describe('UserUpdateBodySchema', () => {
  it('should validate a valid body', async () => {
    expect.assertions(1);

    const { error } = UserUpdateBodySchema.validate({
      role: 'ADMIN',
    });

    expect(error).toBeUndefined();
  });

  it('should validate a valid body with no optional fields', async () => {
    expect.assertions(1);

    const { error } = UserUpdateBodySchema.validate({});

    expect(error).toBeUndefined();
  });

  it('should not validate a body with wrong role', async () => {
    expect.assertions(1);

    const { error } = UserUpdateBodySchema.validate({
      role: 'WRONG_ROLE',
    });

    expect(error).toBeDefined();
  });

  it('should not validate a body with wrong isPrivate', async () => {
    expect.assertions(1);

    const { error } = UserUpdateBodySchema.validate({
      isVerified: 'wrong_isVerified',
    });

    expect(error).toBeDefined();
  });

  it('should not validate a body with wrong fields', async () => {
    expect.assertions(1);

    const { error } = UserUpdateBodySchema.validate({
      wrongField: 'wrongField',
    });

    expect(error).toBeDefined();
  });
});
