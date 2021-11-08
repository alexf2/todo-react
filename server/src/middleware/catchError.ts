import {ErrorRequestHandler} from 'express';
import {Error} from 'mongoose';
import {Logger, CustomError, addRequestId} from '../helpers';

/**
 * Middleware, представляющее обработчик ошибок для контроллеров. Должно устанавливаться в цепочку
 * на рутовй Url контроллера после методов контроллера.
 */
export const catchError = (logger: Logger): ErrorRequestHandler => (err, req, res, next) => {
    let httpError;
    let logError;

    if (!err) {
        next();
        return;
    }

    if (err instanceof Error.CastError || err.name === 'ValidationError') { // ошибка валидатора request
        httpError = {
            code: 400,
            name: err.name || 'CastError',
            message: err.message,
            data: err.value,
        };
        logError = {
            code: 400,
            name: err.name || 'CastError',
            message: err.message,
            data: err.value,
            stack: err.stack,
        };
    } else if (err instanceof CustomError) {
        httpError = err.mapToHttpResponse();
        logError = err.mapToServerLog();
    } else if (err instanceof Error) {
        httpError = {
            code: 500,
            name: `GeneralInternalServerError: ${err.name}`,
            message: 'Internal server error', // Мод. 5.2: скрытие внутренних ошибок
        };
        logError = {
            code: 500,
            name: `GeneralInternalServerError: ${err.name}`,
            message: err.message,
            stack: err.stack,
        };
    } else {
        httpError = {
            code: 500,
            name: 'UnknownError',
            message: err.message || typeof err.toString === 'function' && err.toString(),
        };
        logError = httpError;
    }

    const {code, ...rest} = httpError;
    res.status(code).json({...rest});

    const {message, stack, ...restLog} = logError;
    logger.error(message || logError.name, {meta: addRequestId(req, {...restLog}), stack});
};
