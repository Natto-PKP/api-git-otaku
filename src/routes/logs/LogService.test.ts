import { LogModel } from '../../models';
import { LogService } from './LogService';

describe('createOne', () => {
  it('should create a log', async () => {
    expect.assertions(1);

    const log = await LogModel.create({
      type: 'ERROR',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });

    expect(log).toBeDefined();
  });
});

describe('getAll', () => {
  it('should get all logs', async () => {
    expect.assertions(2);

    const logs = await LogService.getAll({ page: 1, limit: 10, offset: 0 }, {}, { scope: 'private', count: true });

    expect(logs.data).toBeDefined();
    expect(Array.isArray(logs.data)).toBe(true);
  });

  it('should get all logs with query', async () => {
    expect.assertions(2);

    const logs = await LogService.getAll(
      { page: 1, limit: 10, offset: 0 },
      { type: 'ERROR', status: 500, code: 'INTERNAL_SERVER_ERROR' },
      { scope: 'private', count: true }
    );

    expect(logs.data).toBeDefined();
    expect(Array.isArray(logs.data)).toBe(true);
  });

  it('should get all logs with query and pagination', async () => {
    expect.assertions(2);

    const logs = await LogService.getAll(
      { page: 1, limit: 10, offset: 0 },
      { type: 'ERROR', status: 500, code: 'INTERNAL_SERVER_ERROR' },
      { scope: 'private', count: true }
    );

    expect(logs.data).toBeDefined();
    expect(Array.isArray(logs.data)).toBe(true);
  });
});

describe('getOne', () => {
  it('should get a log', async () => {
    expect.assertions(1);

    const log = await LogModel.create({
      type: 'ERROR',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });

    const found = await LogService.getOne(log.id);

    await log.destroy();

    expect(found).toBeDefined();
  });

  it('should not get a log', async () => {
    expect.assertions(1);

    const found = await LogService.getOne('invalid-id');

    expect(found).toBeNull();
  });

  it('should get a log with options', async () => {
    expect.assertions(1);

    const log = await LogModel.create({
      type: 'ERROR',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });

    const found = await LogService.getOne(log.id, { scope: 'private' });

    await log.destroy();

    expect(found).toBeDefined();
  });
});

describe('deleteOne', () => {
  it('should delete a log', async () => {
    expect.assertions(1);

    const log = await LogModel.create({
      type: 'ERROR',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });

    await LogService.deleteOne(log);

    const found = await LogService.getOne(log.id);

    expect(found).toBeNull();
  });

  it('should delete a log with id', async () => {
    expect.assertions(1);

    const log = await LogModel.create({
      type: 'ERROR',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });

    await LogService.deleteOne(log.id);

    const found = await LogService.getOne(log.id);

    expect(found).toBeNull();
  });

  it('should not delete a log', async () => {
    expect.assertions(1);

    await LogService.deleteOne('invalid-id');

    expect(true).toBe(true);
  });
});
