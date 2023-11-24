import { ApiLogGetAllQuerySchema } from './ApiLogSchema';

describe('ApiLogGetAllQuerySchema', () => {
  it('should validate a valid query', async () => {
    expect.assertions(1);

    const { error } = ApiLogGetAllQuerySchema.validate({
      type: 'ERROR',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
    });

    expect(error).toBeUndefined();
  });

  it('should validate a valid query with no optional fields', async () => {
    expect.assertions(1);

    const { error } = ApiLogGetAllQuerySchema.validate({});

    expect(error).toBeUndefined();
  });

  it('should not validate a query with wrong type', async () => {
    expect.assertions(1);

    const { error } = ApiLogGetAllQuerySchema.validate({
      type: 'WRONG_TYPE',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
    });

    expect(error).toBeDefined();
  });

  it('should not validate a query with wrong status', async () => {
    expect.assertions(1);

    const { error } = ApiLogGetAllQuerySchema.validate({
      type: 'ERROR',
      status: -1,
      code: 'INTERNAL_SERVER_ERROR',
    });

    expect(error).toBeDefined();
  });

  it('should not validate a query with wrong code', async () => {
    expect.assertions(1);

    const { error } = ApiLogGetAllQuerySchema.validate({
      type: 'ERROR',
      status: 500,
      code: 'WRONG_CODE',
    });

    expect(error).toBeDefined();
  });
});
