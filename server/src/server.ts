import * as http from 'http';
import helmet from 'helmet';
import {URLSearchParams} from 'url';
import nocache from 'nocache';
import cors from 'cors';
import express, {Application, Request, Response, NextFunction} from 'express';
import {
    requestId,
    route404Handler,
    getBadRequestErrorHandler,
    getUnhandledErrorHandler,
    getUnhandledRejectionHandler,
    userAuthMiddleware,
} from './middleware';
import {TodoController, ReferenceController} from './controllers';
import {loggers, Logger} from './helpers';
import {ConnectionManager} from './ConnectionManager';
import {iniDb} from './models/initializeDb';


export class SimpleExpressServer {
    private httpServer?: http.Server;
    private isShuttingdown = false;

    constructor(
        private ip: string,
        private port: number,
        private logger: Logger,
        private app: Application = express()) {

        // https://evanhahn.com/gotchas-with-express-query-parsing-and-how-to-avoid-them/
        app.set('query parser', queryString => new URLSearchParams(queryString));

        this.logger.info('Server is being initialized...');
    }

    public readonly run = async () => {
        this.logger.info('Server is about to run');

        await ConnectionManager.open();
        // iniDb(loggers.Initialization); // populating Db
        this.addGlobalPreMiddlewares();
        this.addControllers();
        this.addGlobalPostMiddlewares();
        this.addProcessErrorHandlers();

        // запуск сервера
        this.httpServer = this.app.listen(
            this.port,
            this.ip,
            () => this.logger.info(`Server listens ${this.ip}:${this.port}`),
        );
        // обработчик на завершение процесса для корректной очистки ресурсов, закрытия коннекшенов
        process.on('SIGINT', this.cleanup);
        process.on('SIGTERM', this.cleanup);
    }

    private readonly cleanup = async () => {
        this.isShuttingdown = true;

        const timeout = setTimeout(() => {
            this.logger.warn('Couldn\'t close Express connections on time, forcing shut down');
            process.exit(1);
        }, 30000).unref();

        await ConnectionManager.close();

        // тут надо закрыть входящие соединения клиентов к серверу
        this.httpServer?.close(async () => {
            clearTimeout(timeout);
            this.logger.info('Express server with connections closed gracefully.');
            process.exit();
        });
    }

    private readonly restartingMiddleware = (req: Request, res: Response, next: NextFunction) => {
        if (this.isShuttingdown) {
            res.setHeader('Connection', 'close');
            res.status(503).send('Server is in the process of restarting');
        }
        else {
            next();
        }
    }

    /**
     * Добавляет middleware, которое должно обработать запрос до конмтроллеров.
     */
    private readonly addGlobalPreMiddlewares = () => {
        this.app.use(
            helmet.hidePoweredBy(),
            helmet.xssFilter(),
            helmet.referrerPolicy(),
            helmet.frameguard(),
            helmet.dnsPrefetchControl(),
            nocache(),
        );
        this.app.use(
            requestId,
            this.restartingMiddleware,
            userAuthMiddleware(loggers.Core),
            cors(),
            express.json(),
        );
    }

    /**
     * Добавляет middleware, которое должно обработать запрос после конмтроллеров.
     */
    private readonly addGlobalPostMiddlewares = () => {
        this.app.use(route404Handler, getBadRequestErrorHandler(this.logger));
    }

    // добавляется после GlobalMiddlewares
    private readonly addControllers = () => {
        new TodoController(loggers.TodoService).install(this.app);
        new ReferenceController(loggers.RefService).install(this.app);
    }

    private readonly addProcessErrorHandlers = () => {
        process.on('uncaughtException', getUnhandledErrorHandler(this.logger));
        process.on('unhandledRejection', getUnhandledRejectionHandler(this.logger));
    }
}
