/* eslint-disable no-bitwise */
export class FlagManager<T extends { [key: string]: bigint }> {
  constructor(public flags: T) {}

  public has(current: bigint | keyof T | (keyof T)[], needed: bigint | keyof T | (keyof T)[]) {
    const currentBit = typeof current === 'bigint' ? current : this.merge(current);
    const neededBit = typeof needed === 'bigint' ? needed : this.merge(needed);

    return (currentBit & neededBit) === neededBit;
  }

  public resolve(bit: bigint): (keyof T)[] {
    const { flags } = this;

    const result = Object.entries(flags).filter((tag) => (bit & flags[tag[0]]) === tag[1]);
    return result.map(([key]) => key);
  }

  public merge(keys: keyof T | (keyof T)[]) {
    const { flags } = this;

    if (Array.isArray(keys)) return keys.reduce((acc, key) => acc | flags[key], 0n);
    return flags[keys];
  }
}
