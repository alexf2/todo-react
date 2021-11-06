import * as core from 'express-serve-static-core';
import {NextFunction, Request, Response} from 'express';

export interface GenericRequest<
    Locals extends Record<string, any> = Record<string, any>
> extends Request<core.ParamsDictionary, any, any, any, Locals> {};

export type AsyncExpressHandler = (req: GenericRequest, res: Response, next: NextFunction) => Promise<any>;

export const safeAsyncHandler = (callback: AsyncExpressHandler) =>
    async (req: GenericRequest, res: Response, next: NextFunction) => callback(req, res, next).catch(next);
