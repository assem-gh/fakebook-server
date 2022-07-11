import { error } from 'console';
import { Request, Response, NextFunction } from 'express';
import { QueryFailedError, TypeORMError } from 'typeorm';

import { ZodError } from 'zod';

import { HttpError } from '../utils/HttpError';

const handleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const { status, message } = handleZodErrors(err);

    res.status(status).send({ message });
  } else if (err instanceof TypeORMError) {
    const { status, message } = handleTypeormErrors(err);

    res.status(status).send({ message });
  } else {
    res.status(500).send({
      message: 'Server Error',
    });
  }
};

export default handleError;

const handleTypeormErrors = (err: TypeORMError): HttpError => {
  if (err instanceof QueryFailedError) {
    if (err.driverError.code === 23505)
      return {
        name: err.name,
        status: 409,
        message: err.driverError.detail.replace(/^Key |[()]/g, ''),
      };
  }

  return {} as HttpError;
};

const handleZodErrors = (err: ZodError): HttpError => {
  return {
    name: err.name,
    status: 400,
    message: err.issues.flatMap((issue) => issue.message).join(', '),
  };
};
