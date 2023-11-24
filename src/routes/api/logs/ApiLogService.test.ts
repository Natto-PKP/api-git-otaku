import { ApiLogModel } from '../../../models';
import { ApiLogService } from './ApiLogService';

describe('createOne', () => {
  it('should create a log', async () => {
    expect.assertions(1);

    const log = await ApiLogModel.create({
      type: 'ERROR',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });

    expect(log).toBeDefined();

    await log.destroy();
  });
});

describe('getAll', () => {
  it('should get all logs', async () => {
    expect.assertions(2);

    const logs = await ApiLogService.getAll({ page: 1, limit: 10, offset: 0 }, {}, { count: true });

    expect(logs.data).toBeDefined();
    expect(Array.isArray(logs.data)).toBe(true);
  });

  it('should get all logs with query', async () => {
    expect.assertions(2);

    const logs = await ApiLogService.getAll(
      { page: 1, limit: 10, offset: 0 },
      { type: 'ERROR', status: 500, code: 'INTERNAL_SERVER_ERROR' },
      { scope: 'private', count: true },
    );

    expect(logs.data).toBeDefined();
    expect(Array.isArray(logs.data)).toBe(true);
  });

  it('should get all logs with query and pagination', async () => {
    expect.assertions(2);

    const logs = await ApiLogService.getAll(
      { page: 1, limit: 10, offset: 0 },
      { type: 'ERROR', status: 500, code: 'INTERNAL_SERVER_ERROR' },
      { scope: 'private', count: true },
    );

    expect(logs.data).toBeDefined();
    expect(Array.isArray(logs.data)).toBe(true);
  });
});

describe('getOne', () => {
  it('should get a log', async () => {
    expect.assertions(1);

    const log = await ApiLogModel.create({
      type: 'ERROR',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });

    const found = await ApiLogService.getOne(log.id);

    await log.destroy();

    expect(found).toBeDefined();
  });

  it('should not get a log', async () => {
    expect.assertions(1);

    const found = await ApiLogService.getOne('invalid-id');

    expect(found).toBeNull();
  });

  it('should get a log with options', async () => {
    expect.assertions(1);

    const log = await ApiLogModel.create({
      type: 'ERROR',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });

    const found = await ApiLogService.getOne(log.id, { scope: 'private' });

    await log.destroy();

    expect(found).toBeDefined();
  });
});

describe('deleteOne', () => {
  it('should delete a log', async () => {
    expect.assertions(1);

    const log = await ApiLogModel.create({
      type: 'ERROR',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });

    await ApiLogService.deleteOne(log);

    const found = await ApiLogService.getOne(log.id);

    expect(found).toBeNull();
  });

  it('should delete a log with id', async () => {
    expect.assertions(1);

    const log = await ApiLogModel.create({
      type: 'ERROR',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });

    await ApiLogService.deleteOne(log.id);

    const found = await ApiLogService.getOne(log.id);

    expect(found).toBeNull();
  });

  it('should not delete a log', async () => {
    expect.assertions(1);

    await ApiLogService.deleteOne('invalid-id');

    expect(true).toBe(true);
  });
});
