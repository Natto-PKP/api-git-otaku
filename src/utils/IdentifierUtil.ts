// Random characters
const numbers = '0123456789'.split('');
const lowers = 'abcdefghijklmnopqrstuvwxyz'.split('');
const uppers = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

// Magic variables
const DEFAULT_LENGTH = 8;
const DEFAULT_CHARACTERS = ['number'];

// Types
type BaseOptions = {
  /**
   * Characters to use
   */
  characters: ('number' | 'lower' | 'upper')[];

  /**
   * Length of identifier
   */
  length: number;
};

/**
 * Identifier service
 * @description Service to handle and generate identifier
 */
export class IdentifierService {
  /**
   * Generate identifier
   * @param options
   * @returns
   */
  static generate(options?: Partial<BaseOptions>) {
    const length = options?.length || DEFAULT_LENGTH;
    const characters = (options?.characters?.length && options.characters) || DEFAULT_CHARACTERS;

    const arr: string[] = [];
    if (characters.includes('lower')) arr.push(...lowers);
    if (characters.includes('upper')) arr.push(...uppers);
    if (characters.includes('number')) arr.push(...numbers);

    const result = Array.from({ length }, () => arr[Math.floor(Math.random() * arr.length)]);
    return result.join('');
  }

  /**
   * Check if string is identifier
   * @param str
   * @param options
   * @returns
   */
  static isIdentifier(str: string, options?: Partial<BaseOptions> & { isSearch?: boolean }) {
    const length = options?.length || DEFAULT_LENGTH;
    const characters = (options?.characters?.length && options.characters) || DEFAULT_CHARACTERS;
    const isSearch = Boolean(options?.isSearch);
    let dynamic = '';

    if (characters.includes('lower')) dynamic += 'a-z';
    if (characters.includes('upper')) dynamic += 'A-Z';
    if (characters.includes('number')) dynamic += '0-9';

    const regexpStr = `${isSearch ? '^.*' : '^'}[${dynamic}]{${length}}${isSearch ? '.*$' : '$'}`;
    const regexp = new RegExp(regexpStr, 'g');

    return regexp.test(str);
  }
}
