import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import { AuthService } from './AuthService';
import { UserModel } from '../../models';

const user = {
  id: uuid(),
  username: 'username',
  email: 'email',
  password: 'password',
} as UserModel;

describe('generateJwtAccessToken', () => {
  it('should generate a jwt access token', async () => {
    expect.assertions(1);

    const token = await AuthService.generateJwtAccessToken(user);

    expect(typeof token).toBe('string');
  });

  it('should generate a jwt access token with user id', async () => {
    expect.assertions(1);

    const token = await AuthService.generateJwtAccessToken(user);

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    expect(decoded.id).toBe(user.id);
  });
});

describe('generateJwtRefreshToken', () => {
  it('should generate a jwt refresh token', async () => {
    expect.assertions(1);

    const token = await AuthService.generateJwtRefreshToken(user);

    expect(typeof token).toBe('string');
  });

  it('should generate a jwt refresh token with user id', async () => {
    expect.assertions(1);

    const token = await AuthService.generateJwtRefreshToken(user);

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    expect(decoded.id).toBe(user.id);
  });
});

describe('verifyJwtAccessToken', () => {
  it('should verify a jwt access token', async () => {
    expect.assertions(1);

    const token = await AuthService.generateJwtAccessToken(user);

    const decoded = await AuthService.verifyJwtAccessToken(token);

    expect(decoded.id).toBe(user.id);
  });

  it('should not verify a jwt access token', async () => {
    expect.assertions(1);

    const token = await AuthService.generateJwtAccessToken(user);

    const decoded = await AuthService.verifyJwtAccessToken(token);

    expect(decoded.id).toBe(user.id);
  });
});

describe('verifyJwtRefreshToken', () => {
  it('should verify a jwt refresh token', async () => {
    expect.assertions(1);

    const token = await AuthService.generateJwtRefreshToken(user);

    const decoded = await AuthService.verifyJwtRefreshToken(token);

    expect(decoded.id).toBe(user.id);
  });

  it('should not verify a jwt refresh token', async () => {
    expect.assertions(1);

    const token = await AuthService.generateJwtRefreshToken(user);

    const decoded = await AuthService.verifyJwtRefreshToken(token);

    expect(decoded.id).toBe(user.id);
  });
});

describe('comparePassword', () => {
  it('should compare a password', async () => {
    expect.assertions(1);

    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 10);

    const compared = await AuthService.comparePassword(password, hashedPassword);

    expect(compared).toBe(true);
  });

  it('should not compare a password', async () => {
    expect.assertions(1);

    const password = 'password';
    const wrongPassword = 'wrongPassword';
    const hashedPassword = await bcrypt.hash(password, 10);

    const compared = await AuthService.comparePassword(wrongPassword, hashedPassword);

    expect(compared).toBe(false);
  });
});
