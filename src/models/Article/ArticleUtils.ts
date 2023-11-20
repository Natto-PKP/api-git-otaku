export type ArticleType = 'ANIME' | 'MANGA' | 'WEBTOON' | 'NOVEL' | 'MOVIE' | 'SERIE' | 'OTHER' | 'UNKNOWN';
export type ArticleStatus = 'ONGOING' | 'FINISHED' | 'CANCELLED' | 'UNKNOWN' | 'PENDING';
export type ArticleVisibility = 'PUBLISHED' | 'DRAFT' | 'DELETED' | 'SUGGESTED';

export const ArticleTypes: ArticleType[] = ['ANIME', 'MANGA', 'WEBTOON', 'NOVEL', 'MOVIE', 'SERIE', 'OTHER', 'UNKNOWN'];
export const ArticleStatuses: ArticleStatus[] = ['ONGOING', 'FINISHED', 'CANCELLED', 'UNKNOWN', 'PENDING'];
export const ArticleVisibilities: ArticleVisibility[] = ['SUGGESTED', 'PUBLISHED', 'DRAFT', 'DELETED'];
