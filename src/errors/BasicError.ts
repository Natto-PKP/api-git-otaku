import { IErrorOptions, BaseError, ErrorCode, ErrorCodes, ErrorType } from './BaseError';

interface IBasicErrorParams {
  type?: ErrorType;
  status?: number;
  code?: ErrorCode;
  message?: string;
}

/**
 * Basic error
 */
export class BasicError extends BaseError {
  public status: number; // HTTP status code

  public code: ErrorCode; // error code

  constructor(params: IBasicErrorParams, options?: IErrorOptions | null) {
    const type = params.type || 'ERROR';
    const status = params.status || 500;
    const code = params.code || 'INTERNAL_SERVER_ERROR';
    const message = params.message || ErrorCodes[code];
    const opts = options || null;

    super(message, type, opts);

    this.status = status;
    this.code = code;
  }

  public get data() {
    return {
      type: this.type,
      status: this.status,
      code: this.code,
      message: this.message,
      stack: this.stack,
    };
  }
}

export const PermissionError = (message?: string, options: IErrorOptions = {}) => {
  return new BasicError({ code: 'MISSING_PERMISSION', status: 403, message }, options);
};

export const AuthenticationError = (message?: string, options: IErrorOptions = {}) => {
  return new BasicError({ code: 'UNAUTHORIZED', status: 401, message }, options);
};

export const NotFoundError = (message?: string, options: IErrorOptions = {}) => {
  return new BasicError({ code: 'NOT_FOUND', status: 404, message }, options);
};

export const ForbiddenError = (message?: string, options: IErrorOptions = {}) => {
  return new BasicError({ code: 'FORBIDDEN', status: 403, message }, options);
};
