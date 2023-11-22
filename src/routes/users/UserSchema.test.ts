import { UserAdminUpdateBodySchema, UserGetAllQuerySchema, UserSelfUpdateBodySchema } from './UserSchema';

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

describe('UserSelfUpdateBodySchema', () => {
  it('should validate a valid body', async () => {
    expect.assertions(1);

    const { error } = UserSelfUpdateBodySchema.validate({
      username: 'user',
      pseudo: 'Super user',
      email: 'user@domain.com',
      password: 'Password1L!',
      isPrivate: true,
    });

    expect(error).toBeUndefined();
  });

  it('should validate a valid body with no optional fields', async () => {
    expect.assertions(1);

    const { error } = UserSelfUpdateBodySchema.validate({});

    expect(error).toBeUndefined();
  });

  it('should not validate a body with wrong username', async () => {
    expect.assertions(1);

    const { error } = UserSelfUpdateBodySchema.validate({
      username: 'wrong_',
    });

    expect(error).toBeDefined();
  });

  it('should not validate a body with wrong pseudo', async () => {
    expect.assertions(1);

    const { error } = UserSelfUpdateBodySchema.validate({
      pseudo: 'wrong_ ',
    });

    expect(error).toBeDefined();
  });

  it('should not validate a body with wrong email', async () => {
    expect.assertions(1);

    const { error } = UserSelfUpdateBodySchema.validate({
      email: 'wrong_email',
    });

    expect(error).toBeDefined();
  });

  it('should not validate a body with wrong password', async () => {
    expect.assertions(1);

    const { error } = UserSelfUpdateBodySchema.validate({
      password: 'wrong_password',
    });

    expect(error).toBeDefined();
  });
});

describe('UserAdminUpdateBodySchema', () => {
  it('should validate a valid body', async () => {
    expect.assertions(1);

    const { error } = UserAdminUpdateBodySchema.validate({
      username: 'user',
      pseudo: 'Super user',
      role: 'ADMIN',
      isPrivate: true,
    });

    expect(error).toBeUndefined();
  });

  it('should validate a valid body with no optional fields', async () => {
    expect.assertions(1);

    const { error } = UserAdminUpdateBodySchema.validate({});

    expect(error).toBeUndefined();
  });

  it('should not validate a body with wrong username', async () => {
    expect.assertions(1);

    const { error } = UserAdminUpdateBodySchema.validate({
      username: 'wrong_',
    });

    expect(error).toBeDefined();
  });

  it('should not validate a body with wrong pseudo', async () => {
    expect.assertions(1);

    const { error } = UserAdminUpdateBodySchema.validate({
      pseudo: 'wrong_ ',
    });

    expect(error).toBeDefined();
  });

  it('should not validate a body with wrong role', async () => {
    expect.assertions(1);

    const { error } = UserAdminUpdateBodySchema.validate({
      role: 'wrong_role',
    });

    expect(error).toBeDefined();
  });

  it('should not validate a body with wrong fields', async () => {
    expect.assertions(1);

    const { error } = UserAdminUpdateBodySchema.validate({
      wrongField: 'wrongField',
    });

    expect(error).toBeDefined();
  });
});
