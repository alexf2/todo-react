/**
 * Logger for backend
 */
import * as W from 'winston';
import 'winston-daily-rotate-file';
import {Config} from './Config';

export type Logger = W.Logger;

// TODO: проверить, будет ли работать с PM2
const COMMON_LOG_FILE_NAME = './logs/common.log';
const TIME_FORMAT = 'HH:mm:ss SSS';
const {combine, timestamp, prettyPrint, colorize, json, simple, printf} = W.format;

// eslint-disable-next-line @typescript-eslint/no-shadow
const customFormatter = printf(({message, level, timestamp, component, meta, stack}) => {
    let layout = `${timestamp} [${component}] ${level}: ${message}`;
    if (meta) {
        layout += `\r\n\tMeta: ${JSON.stringify(meta)}`;
    }
    if (stack) {
        layout += `\r\n${stack}`;
    }
    return layout;
});

// https://www.datadoghq.com/blog/node-logging-best-practices/
class LoggersManager {
    private isCreated = false;
    private initializationLogger: W.Logger | undefined;
    private coreLogger: W.Logger | undefined;
    private todoServiceLogger: W.Logger | undefined;
    private refServiceLogger: W.Logger | undefined;

    private readonly create = () => {
        if (!this.isCreated) {
            const level = Config.logLevel;
            const format = Config.logFormat;
            const transport = Config.logTransport;
            const logSink = transport === 'Console' ?
                new (W.transports.Console)()
                :
                new (W.transports.DailyRotateFile)({
                    datePattern: 'DD-MM-YYYY',
                    filename: COMMON_LOG_FILE_NAME,
                });

            this.isCreated = true;

            const baseConfig = {
                level,
                format: combine(
                    ...([
                        timestamp({format: TIME_FORMAT}),
                        // label({label: 'm_service'}), // добавляется рядом с message
                        prettyPrint(),
                        transport === 'Console' ? colorize() : undefined,
                        format === 'Simple' ? simple() : json(),
                        customFormatter,
                    ].filter(Boolean) as W.Logform.Format[]),
                ),
                transports: [logSink],
            };

            this.initializationLogger = W.createLogger({
                defaultMeta: {component: 'INITIALIZATION'},
                ...baseConfig,
            });

            this.coreLogger = W.createLogger({
                defaultMeta: {component: 'CORE'},
                ...baseConfig,
            });

            this.todoServiceLogger = W.createLogger({
                defaultMeta: {component: 'TODO_SERVICE'},
                ...baseConfig,
            });

            this.refServiceLogger = W.createLogger({
                defaultMeta: {component: 'REFERENCE_SERVICE'},
                ...baseConfig,
            });
        }
    }

    public get Initialization() {
        this.create();
        return this.initializationLogger!;
    }

    public get Core() {
        this.create();
        return this.coreLogger!;
    }

    public get TodoService() {
        this.create();
        return this.todoServiceLogger!;
    }

    public get RefService() {
        this.create();
        return this.refServiceLogger!;
    }
}

export const loggers = new LoggersManager();
