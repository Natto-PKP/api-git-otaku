import supertest from 'supertest';

import { server } from '../../server';
import { UserModel } from '../../models';

const request = supertest(server);

const email = 'test@domain.com';
const wrongEmail = 'test@domain.';
const username = 'ferret';
const wrongUsername = 'ferret_';
const password = '!lOv2ferret';
const wrongPassword = 'iloveferret';
const pseudo = 'Super ferret';
const wrongPseudo = 'Super ferret! ';

describe('POST /register', () => {
  it('should register a new user', async () => {
    expect.assertions(3);

    const response = await request.post('/auth/register').send({
      email,
      username,
      password,
      pseudo,
    });

    await UserModel.destroy({ where: { email } });

    expect(response.status).toBe(201);

    const cookies = response.get('Set-Cookie');

    expect(cookies).toBeDefined();
    expect(cookies.length).toBe(2);
  });

  it('should not register a new user with wrong email', async () => {
    expect.assertions(1);

    const response = await request.post('/auth/register').send({
      email: wrongEmail,
      username,
      password,
      pseudo,
    });

    expect(response.status).toBe(400);
  });

  it('should not register a new user with wrong username', async () => {
    expect.assertions(1);

    const response = await request.post('/auth/register').send({
      email,
      username: wrongUsername,
      password,
      pseudo,
    });

    expect(response.status).toBe(400);
  });

  it('should not register a new user with wrong password', async () => {
    expect.assertions(1);

    const response = await request.post('/auth/register').send({
      email,
      username,
      password: wrongPassword,
      pseudo,
    });

    expect(response.status).toBe(400);
  });

  it('should not register a new user with wrong pseudo', async () => {
    expect.assertions(1);

    const response = await request.post('/auth/register').send({
      email,
      username,
      password,
      pseudo: wrongPseudo,
    });

    expect(response.status).toBe(400);
  });
});

describe('POST /login', () => {
  it('should login a user with username', async () => {
    expect.assertions(3);

    await UserModel.create({ email, username, password, pseudo });

    const response = await request.post('/auth/login').send({
      username,
      password,
    });

    await UserModel.destroy({ where: { email } });

    const cookies = response.get('Set-Cookie');

    expect(response.status).toBe(200);
    expect(cookies).toBeDefined();
    expect(cookies.length).toBe(2);
  });

  it('should login a user with email', async () => {
    expect.assertions(1);

    await UserModel.create({ email, username, password, pseudo });

    const response = await request.post('/auth/login').send({
      email,
      password,
    });

    await UserModel.destroy({ where: { email } });

    expect(response.status).toBe(200);
  });

  it('should not login a user with wrong username', async () => {
    expect.assertions(1);

    const response = await request.post('/auth/login').send({
      username: wrongUsername,
      password,
    });

    expect(response.status).toBe(400);
  });

  it('should not login a user with wrong email', async () => {
    expect.assertions(1);

    const response = await request.post('/auth/login').send({
      email: wrongEmail,
      password,
    });

    expect(response.status).toBe(400);
  });

  it('should not login a user with wrong password', async () => {
    expect.assertions(1);

    const response = await request.post('/auth/login').send({
      username,
      password: wrongPassword,
    });

    expect(response.status).toBe(400);
  });

  it('should not login a user with a emain and a username', async () => {
    expect.assertions(1);

    const response = await request.post('/auth/login').send({
      username,
      email,
      password,
    });

    expect(response.status).toBe(400);
  });

  it('should not login a user with invalid credentials', async () => {
    expect.assertions(1);

    const response = await request.post('/auth/login').send({
      username: 'invalid',
      password,
    });

    expect(response.status).toBe(400);
  });
});

describe('POST /refresh', () => {
  it("should not refresh a user token (can't do it with unit test)", async () => {
    expect.assertions(1);

    const response = await request.post('/auth/refresh').send();

    expect(response.status).toBe(401);
  });
});

describe('DELETE /logout', () => {
  it('should logout a user', async () => {
    expect.assertions(1);

    const response = await request.delete('/auth/logout').send();

    expect(response.status).toBe(204);
  });
});
