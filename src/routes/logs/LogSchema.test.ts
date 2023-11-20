import { LogGetAllQuerySchema } from './LogSchema';

describe('LogGetAllQuerySchema', () => {
  it('should validate a valid query', async () => {
    expect.assertions(1);

    const { error } = LogGetAllQuerySchema.validate({
      type: 'ERROR',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      page: 1,
      limit: 10,
      offset: 0,
    });

    expect(error).toBeUndefined();
  });

  it('should validate a valid query with no optional fields', async () => {
    expect.assertions(1);

    const { error } = LogGetAllQuerySchema.validate({});

    expect(error).toBeUndefined();
  });

  it('should not validate a query with wrong type', async () => {
    expect.assertions(1);

    const { error } = LogGetAllQuerySchema.validate({
      type: 'WRONG_TYPE',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      page: 1,
      limit: 10,
      offset: 0,
    });

    expect(error).toBeDefined();
  });

  it('should not validate a query with wrong status', async () => {
    expect.assertions(1);

    const { error } = LogGetAllQuerySchema.validate({
      type: 'ERROR',
      status: -1,
      code: 'INTERNAL_SERVER_ERROR',
      page: 1,
      limit: 10,
      offset: 0,
    });

    expect(error).toBeDefined();
  });

  it('should not validate a query with wrong code', async () => {
    expect.assertions(1);

    const { error } = LogGetAllQuerySchema.validate({
      type: 'ERROR',
      status: 500,
      code: 'WRONG_CODE',
      page: 1,
      limit: 10,
      offset: 0,
    });

    expect(error).toBeDefined();
  });

  it('should not validate a query with wrong page', async () => {
    expect.assertions(1);

    const { error } = LogGetAllQuerySchema.validate({
      type: 'ERROR',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      page: -1,
      limit: 10,
      offset: 0,
    });

    expect(error).toBeDefined();
  });

  it('should not validate a query with wrong limit', async () => {
    expect.assertions(1);

    const { error } = LogGetAllQuerySchema.validate({
      type: 'ERROR',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      page: 1,
      limit: -1,
      offset: 0,
    });

    expect(error).toBeDefined();
  });

  it('should not validate a query with wrong offset', async () => {
    expect.assertions(1);

    const { error } = LogGetAllQuerySchema.validate({
      type: 'ERROR',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      page: 1,
      limit: 10,
      offset: -1,
    });

    expect(error).toBeDefined();
  });
});
