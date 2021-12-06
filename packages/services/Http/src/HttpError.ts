import axios from 'axios';

interface HttpErrorOptionsProps {
  statusCode?: number
  ignore?: boolean
  error?: string
}

export class HttpError extends Error {
  private readonly _statusCode?: number;

  private readonly _ignore?: boolean;

  private readonly _error?: string;

  constructor(message: string, options?: HttpErrorOptionsProps) {
    super(message);
    if (typeof options !== 'object') return;
    this._statusCode = options.statusCode;
    this._ignore = options.ignore;
    this._error = options.error;
  }

  /**
   * Error has been processed and can be ignored on UI level.
   */
  get ignore(): boolean {
    return !!this._ignore;
  }

  /**
   * Response error code
   */
  get statusCode(): number | undefined {
    return this._statusCode;
  }

  get error(): string | undefined {
    return typeof this._error;
  }
}

export const handleHttpError = (e: unknown): HttpError => {
  if (!Object.hasOwnProperty.call(e, 'message')) {
    return new HttpError('Undefined Error');
  }
  if (axios.isCancel(e)) {
    return new HttpError('Request Canceled', {
      ignore: true,
    });
  }
  if (!axios.isAxiosError(e) || !e.response || !e.response.data) {
    return new HttpError((e as Error).message || 'No response data');
  }

  const { status, statusText, data } = e.response;

  return new HttpError(statusText, {
    statusCode: status,
    error: data,
    ignore: [404, 401].includes(status),
  });
};
