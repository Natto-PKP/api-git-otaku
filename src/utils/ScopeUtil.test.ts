import { ScopeUtil, type Scopes } from './ScopeUtil';

const config = {
  public: {
    options: { where: { public: true } },
  },
  internal: {
    options: { where: { internal: true } },
    roles: ['ADMIN'],
  },
  private: {
    options: { where: { private: true } },
    self: true,
  },
  system: {
    options: { where: { system: true } },
  },
};

const scopes = new ScopeUtil(config as Scopes);

describe('getScope', () => {
  it('should get scope', () => {
    expect(scopes.getScope('public')).toEqual(config.public);
  });

  it('should get system scope', () => {
    expect(scopes.getScope('system')).toEqual(config.system);
  });
});

describe('default', () => {
  it('should get default scope', () => {
    expect(scopes.default()).toEqual(config.public.options);
  });
});

describe('scopes', () => {
  it('should get all scopes', () => {
    expect(scopes.scopes()).toEqual({
      public: config.public.options,
      internal: config.internal.options,
      private: config.private.options,
      system: config.system.options,
    });
  });
});

describe('verify', () => {
  it('should verify public scope', () => {
    expect(scopes.verify('public')).toEqual(true);
  });

  it('should verify system scope', () => {
    expect(scopes.verify('system')).toEqual(false);
  });

  it('should verify internal scope', () => {
    expect(scopes.verify('internal', { role: 'ADMIN' })).toEqual(true);
  });

  it('should verify private scope', () => {
    expect(scopes.verify('private', { self: true })).toEqual(true);
  });
});
