import {
  IErrorOptions, BaseError, ErrorCode, ErrorCodes, ErrorType,
} from './BaseError';

interface IBasicErrorParams {
  type?: ErrorType;
  status?: number;
  code?: ErrorCode;
  message?: string;
}

/**
 * Basic error
 */
export default class BasicError extends BaseError {
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
}
