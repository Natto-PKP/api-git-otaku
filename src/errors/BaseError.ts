export enum ErrorCodes {
  // 400
  BAD_REQUEST = 'Invalid syntax',
  INVALID_CREDENTIALS = 'Invalid credentials',
  USER_ALREADY_EXISTS = 'User already exists',
  VALIDATION_ERROR = 'Validation error',

  // 401
  UNAUTHORIZED = 'Authentication is required',
  TOKEN_EXPIRED = 'The token has expired',

  // 403
  FORBIDDEN = 'You are not allowed',
  BLOCKED = 'You are blocked',
  BANNED = 'You are banned',
  MISSING_PERMISSION = 'You are missing permission',

  // 404
  NOT_FOUND = 'The requested resource could not be found',
  ENDPOINT_NOT_FOUND = 'The requested endpoint could not be found',

  // 405
  METHOD_NOT_ALLOWED = 'The requested method is not allowed',

  // 409
  CONFLICT = 'The request could not be completed due to a conflict with the current state of the resource',

  // 500
  INTERNAL_SERVER_ERROR = 'An unexpected error occurred',
  UNKNOW_ERROR = 'An unknown error occurred',

  // 501
  NOT_IMPLEMENTED = 'The requested service is not implemented',

  // 503
  SERVICE_UNAVAILABLE = 'The requested service is unavailable',
}

export type ErrorCode = keyof typeof ErrorCodes;

export type ErrorType = 'FATAL' | 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG' | 'TRACE';

export const ErrorTypes: ErrorType[] = ['FATAL', 'ERROR', 'WARNING', 'INFO', 'DEBUG', 'TRACE'];
export const ErrorCodeNames: string[] = Object.keys(ErrorCodes);

export interface IErrorOptions {
  /**
   * Log the error
   * @default true
   */
  logit?: boolean;
}

export class BaseError extends Error {
  public options: IErrorOptions;

  constructor(message: string, public type: ErrorType = 'ERROR', options?: IErrorOptions | null) {
    super(message);

    this.options = options || {};
    this.options.logit = this.options.logit ?? true;
  }
}
