import {Request, Response, NextFunction} from 'express';
import {NotFoundError} from '../helpers';

export const route404Handler = (req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError('Route', req.url, 'url'));
}
