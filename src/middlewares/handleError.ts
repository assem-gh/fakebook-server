import { Request, Response, NextFunction } from 'express';

import { HttpError } from '../utils/HttpError';

const handleError = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errorToSend = {} as HttpError;

  switch (err) {
    default:
      errorToSend.status = err.status || 500;
      errorToSend.message = err.message || 'Server Error';
  }

  res.status(errorToSend.status).send({
    message: errorToSend.message,
  });
};

export default handleError;
