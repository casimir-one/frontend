import axios from 'axios';

export class HttpError extends Error {
  constructor(message, options) {
    super(message);
    if (typeof options !== 'object') return;
    this._statusCode = options.statusCode;
    this._ignore = options.ignore;
    this._error = options.error;
  }

  /**
   * Error has been processed and can be ignored on UI level.
   * @return {boolean}
   */
  get ignore() {
    return !!this._ignore;
  }

  /**
   * Response error code
   * @return {number | undefined}
   */
  get statusCode() {
    return this._statusCode;
  }

  /**
   * @return {any}
   */
  get error() {
    return this._error;
  }
}

/**
 * @param {Error} e
 * @return {HttpError}
 */
export const handleHttpError = (e) => {
  if (typeof e !== 'object' || !Object.hasOwnProperty.call(e, 'message')) {
    return new HttpError('Undefined Error');
  }
  if (axios.isCancel(e)) {
    return new HttpError('Request Canceled', {
      ignore: true
    });
  }
  if (!axios.isAxiosError(e)) {
    return new HttpError(e.message);
  }
  if (!e.response || !e.response.data) {
    return new HttpError(e.message);
  }

  const { status, statusText, data } = e.response;

  return new HttpError(statusText, {
    statusCode: status,
    error: data.error,
    ignore: [404, 401].includes(status)
  });
};
