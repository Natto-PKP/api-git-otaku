import { FlagManager } from './FlagManager';

const flags = {
  A: 1n << 0n,
  B: 1n << 1n,
  C: 1n << 2n,
};

const flagManager = new FlagManager(flags);

describe('has', () => {
  it('should return true if the bit is set', () => {
    expect(flagManager.has('A', flags.A)).toBe(true);
    expect(flagManager.has('A', flags.B)).toBe(false);
    expect(flagManager.has('B', flags.A)).toBe(false);
    expect(flagManager.has('B', flags.B)).toBe(true);
  });

  it('should return true if the bit is set in a bigint', () => {
    expect(flagManager.has('A', flags.A | flags.B)).toBe(false);
    expect(flagManager.has('A', flags.B | flags.C)).toBe(false);
    expect(flagManager.has('B', flags.A | flags.B)).toBe(false);
    expect(flagManager.has('B', flags.B | flags.C)).toBe(false);
  });

  it('should return true if the bit is set in a list', () => {
    expect(flagManager.has(['A', 'B'], flags.A)).toBe(true);
    expect(flagManager.has(['A', 'B'], flags.B)).toBe(true);
    expect(flagManager.has(['A', 'B'], flags.C)).toBe(false);
  });

  it('should return true if the bit and flag are set in a list', () => {
    expect(flagManager.has(['A', 'B'], ['A'])).toBe(true);
    expect(flagManager.has(['A', 'B'], 'B')).toBe(true);
    expect(flagManager.has(['A', 'B'], ['A', 'C'])).toBe(false);
  });

  it('should return true if the flag is set in a list', () => {
    expect(flagManager.has(['A', 'B'], flags.A | flags.B)).toBe(true);
    expect(flagManager.has(['A', 'B'], flags.A | flags.B)).toBe(true);
    expect(flagManager.has(['A', 'B'], flags.A | flags.C)).toBe(false);
  });
});

describe('resolve', () => {
  it('should return the correct flags', () => {
    expect(flagManager.resolve(flags.A | flags.B)).toEqual(['A', 'B']);
    expect(flagManager.resolve(flags.A | flags.C)).toEqual(['A', 'C']);
    expect(flagManager.resolve(flags.B | flags.C)).toEqual(['B', 'C']);
  });

  it('should return an empty array if no flags are set', () => {
    expect(flagManager.resolve(0n)).toEqual([]);
  });
});

describe('merge', () => {
  it('should merge the flags', () => {
    expect(flagManager.merge(['A', 'B'])).toEqual(flags.A | flags.B);
    expect(flagManager.merge(['A', 'C'])).toEqual(flags.A | flags.C);
    expect(flagManager.merge(['B', 'C'])).toEqual(flags.B | flags.C);
  });

  it('should merge the flags in a bigint', () => {
    expect(flagManager.merge(['A', 'B', 'C'])).toEqual(flags.A | flags.B | flags.C);
  });
});
