import {Config} from './Config';
import {GenericRequest} from './safeAsyncHandler';

export const addRequestId = (req: GenericRequest, meta?: Record<string, unknown>) => {
    const {user} = req as any;

    return {
        ...meta,
        [Config.reqIdHeader]: req[Config.reqIdHeader],
        ...(user && {user: {id: user.id, login: user.login}}),
    };
}

export const getRequestIdMeta = (req: GenericRequest) => ({
    meta: addRequestId(req),
});
