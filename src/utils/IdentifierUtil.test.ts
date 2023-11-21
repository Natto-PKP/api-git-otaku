import { IdentifierService } from './IdentifierUtil';

describe('generate', () => {
  it('should generate an identifier', () => {
    const identifier = IdentifierService.generate();
    expect(identifier).toBeDefined();
  });

  it('should generate an identifier with 6 characters', () => {
    const identifier = IdentifierService.generate({ length: 6 });
    expect(identifier.length).toBe(6);
  });

  it('should generate an identifier with 6 characters and only numbers', () => {
    const identifier = IdentifierService.generate({ length: 6, characters: ['number'] });
    expect(identifier).toMatch(/^\d{6}$/);
  });

  it('should generate an identifier with 6 characters and only lowers', () => {
    const identifier = IdentifierService.generate({ length: 6, characters: ['lower'] });
    expect(identifier).toMatch(/^[a-z]{6}$/);
  });

  it('should generate an identifier with 6 characters and only uppers', () => {
    const identifier = IdentifierService.generate({ length: 6, characters: ['upper'] });
    expect(identifier).toMatch(/^[A-Z]{6}$/);
  });

  it('should generate an identifier with 6 characters and only lowers and numbers', () => {
    const identifier = IdentifierService.generate({ length: 6, characters: ['lower', 'number'] });
    expect(identifier).toMatch(/^[a-z0-9]{6}$/);
  });

  it('should generate an identifier with 6 characters and only uppers and numbers', () => {
    const identifier = IdentifierService.generate({ length: 6, characters: ['upper', 'number'] });
    expect(identifier).toMatch(/^[A-Z0-9]{6}$/);
  });

  it('should generate an identifier with 6 characters and only lowers and uppers', () => {
    const identifier = IdentifierService.generate({ length: 6, characters: ['lower', 'upper'] });
    expect(identifier).toMatch(/^[a-zA-Z]{6}$/);
  });

  it('should generate an identifier with 6 characters and only lowers, uppers and numbers', () => {
    const identifier = IdentifierService.generate({ length: 6, characters: ['lower', 'upper', 'number'] });
    expect(identifier).toMatch(/^[a-zA-Z0-9]{6}$/);
  });
});

describe('isIdentifier', () => {
  it('should return true if string is identifier', () => {
    const identifier = IdentifierService.generate();
    expect(IdentifierService.isIdentifier(identifier)).toBe(true);
  });

  it('should return false if string is not identifier', () => {
    expect(IdentifierService.isIdentifier('')).toBe(false);
    expect(IdentifierService.isIdentifier('123')).toBe(false);
    expect(IdentifierService.isIdentifier('abc')).toBe(false);
    expect(IdentifierService.isIdentifier('ABC')).toBe(false);
    expect(IdentifierService.isIdentifier('abc123')).toBe(false);
    expect(IdentifierService.isIdentifier('ABC123')).toBe(false);
    expect(IdentifierService.isIdentifier('abcABC')).toBe(false);
    expect(IdentifierService.isIdentifier('abcABC123')).toBe(false);
    expect(IdentifierService.isIdentifier('abcABC123!')).toBe(false);
    expect(IdentifierService.isIdentifier('abcABC123@')).toBe(false);
  });
});
