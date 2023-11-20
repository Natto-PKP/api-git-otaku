import { LoginSchema, RegisterSchema } from './AuthSchema';

const email = 'test@domain.com';
const wrongEmail = 'test@domain.';
const username = 'ferret';
const wrongUsername = 'ferret_';
const password = '!lOv2ferret';
const wrongPassword = 'iloveferret';
const pseudo = 'Super ferret';
const wrongPseudo = 'Super ferret! ';

describe('LoginSchema', () => {
  it('should validate a valid login with email', async () => {
    expect.assertions(1);

    const { error } = LoginSchema.validate({
      email,
      password,
    });

    expect(error).toBeUndefined();
  });

  it('should validate a valid login with username', async () => {
    expect.assertions(1);

    const { error } = LoginSchema.validate({
      username,
      password,
    });

    expect(error).toBeUndefined();
  });

  it('should not validate a login with wrong email', async () => {
    expect.assertions(1);

    const { error } = LoginSchema.validate({
      email: wrongEmail,
      password,
    });

    expect(error).toBeDefined();
  });

  it('should not validate a login with wrong username', async () => {
    expect.assertions(1);

    const { error } = LoginSchema.validate({
      username: wrongUsername,
      password,
    });

    expect(error).toBeDefined();
  });

  it('should not validate a login with wrong password', async () => {
    expect.assertions(1);

    const { error } = LoginSchema.validate({
      email,
      password: wrongPassword,
    });

    expect(error).toBeDefined();
  });

  it('should not validate a login with both email and username', async () => {
    expect.assertions(1);

    const { error } = LoginSchema.validate({
      email,
      username,
      password,
    });

    expect(error).toBeDefined();
  });
});

describe('RegisterSchema', () => {
  it('should validate a valid register', async () => {
    expect.assertions(1);

    const { error } = RegisterSchema.validate({
      email,
      username,
      password,
      pseudo,
    });

    expect(error).toBeUndefined();
  });

  it('should not validate a register with wrong email', async () => {
    expect.assertions(1);

    const { error } = RegisterSchema.validate({
      email: wrongEmail,
      username,
      password,
      pseudo,
    });

    expect(error).toBeDefined();
  });

  it('should not validate a register with wrong username', async () => {
    expect.assertions(1);

    const { error } = RegisterSchema.validate({
      email,
      username: wrongUsername,
      password,
      pseudo,
    });

    expect(error).toBeDefined();
  });

  it('should not validate a register with wrong password', async () => {
    expect.assertions(1);

    const { error } = RegisterSchema.validate({
      email,
      username,
      password: wrongPassword,
      pseudo,
    });

    expect(error).toBeDefined();
  });

  it('should not validate a register with wrong pseudo', async () => {
    expect.assertions(1);

    const { error } = RegisterSchema.validate({
      email,
      username,
      password,
      pseudo: wrongPseudo,
    });

    expect(error).toBeDefined();
  });
});
