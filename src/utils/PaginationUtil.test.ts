import { DEFAULT_LIMIT, MAX_LIMIT, MIN_LIMIT, PaginationService } from './PaginationUtil';

describe('getLimit', () => {
  it('should return default limit', () => {
    expect(PaginationService.getLimit()).toBe(DEFAULT_LIMIT);
  });

  it('should return min limit', () => {
    expect(PaginationService.getLimit(-50)).toBe(MIN_LIMIT);
  });

  it('should return max limit', () => {
    expect(PaginationService.getLimit(500)).toBe(MAX_LIMIT);
  });

  it('should return limit', () => {
    expect(PaginationService.getLimit(50)).toBe(50);
  });
});

describe('getPage', () => {
  it('should return page', () => {
    expect(PaginationService.getPage()).toBe(0);
    expect(PaginationService.getPage(0)).toBe(0);
    expect(PaginationService.getPage(1)).toBe(1);
    expect(PaginationService.getPage(2)).toBe(2);
  });

  it('should return 0', () => {
    expect(PaginationService.getPage(-1)).toBe(0);
  });
});

describe('getOffset', () => {
  it('should return offset', () => {
    expect(PaginationService.getOffset()).toBe(0);
    expect(PaginationService.getOffset(0)).toBe(0);
    expect(PaginationService.getOffset(1)).toBe(1);
    expect(PaginationService.getOffset(2)).toBe(2);
  });

  it('should return 0', () => {
    expect(PaginationService.getOffset(-1)).toBe(0);
  });
});

describe('calcOffset', () => {
  it('should calculate offset', () => {
    expect(PaginationService.calcOffset(0, 10)).toBe(0);
    expect(PaginationService.calcOffset(1, 10)).toBe(10);
    expect(PaginationService.calcOffset(2, 10)).toBe(20);
  });

  it('should return 0', () => {
    expect(PaginationService.calcOffset(-1, 10)).toBe(0);
  });
});

describe('from', () => {
  it('should return default pagination', () => {
    expect(PaginationService.from()).toStrictEqual({ offset: 0, limit: DEFAULT_LIMIT, page: 0 });
  });

  it('should return pagination', () => {
    expect(PaginationService.from({ limit: 10, page: 1 })).toStrictEqual({ offset: 10, limit: 10, page: 1 });
  });

  it('should return pagination with default limit', () => {
    expect(PaginationService.from({ page: 1 })).toStrictEqual({ offset: DEFAULT_LIMIT, limit: DEFAULT_LIMIT, page: 1 });
  });

  it('should return pagination with default page', () => {
    expect(PaginationService.from({ limit: 10 })).toStrictEqual({ offset: 0, limit: 10, page: 0 });
  });
});
