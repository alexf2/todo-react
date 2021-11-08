import {RequestHandler, Request} from 'express';
import {v4 as uuidv4} from 'uuid';
import {Logger} from '../helpers';

const ANONYMOUS_USER_ID_COOKIE = 'todo_user_id';

const getCookieValue = (req: Request, name: string) =>
    req.headers.cookie?.match('(^|;)\\s*' + encodeURIComponent(name) + '\\s*=\\s*([^;]+)')?.pop() || '';

export const userAuthMiddleware = (logger: Logger): RequestHandler => (req, res, next) => {
    let userId = getCookieValue(req, ANONYMOUS_USER_ID_COOKIE);
    if (!userId) {
        logger.info('No user. Generating new one.');
        userId = uuidv4();
        res.clearCookie(ANONYMOUS_USER_ID_COOKIE);
        res.cookie(ANONYMOUS_USER_ID_COOKIE, userId, {httpOnly: true, expires: new Date(253402300000000)});
    }

    logger.info(`User ID: ${userId}`);
    (req as any).userId = userId;

    next();
};

