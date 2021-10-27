import {ConnectOptions, connect, disconnect} from 'mongoose';
import {Config, loggers} from './helpers';
import {getUnhandledErrorHandler} from './middleware';

const options: ConnectOptions = {
    autoCreate: false,
    autoIndex: true,
    dbName: Config.db,
    user: Config.user,
    pass: Config.password,
    authSource: Config.user,
};

export class ConnectionManager {
    private static isOpened = false;
    private static logger = loggers.Core;

    public static open = async () => {
        try {
            ConnectionManager.logger.info('Connecting MongoDb');

            await connect(Config.connectionString, options)
            ConnectionManager.isOpened = true;

            ConnectionManager.logger.info('MongoDb connected');
        } catch (error) {
            getUnhandledErrorHandler(ConnectionManager.logger)(error);
        }
    }

    public static get opened() {
        return ConnectionManager.isOpened;
    }

    public static close = async () => {
        if (!ConnectionManager.isOpened) {
            return;
        }

        try {
            ConnectionManager.logger.info('Closing MongoDb');
            await disconnect();
            ConnectionManager.isOpened = false;
            ConnectionManager.logger.info('MongoDb closed');
        } catch (error) {
            getUnhandledErrorHandler(ConnectionManager.logger)(error);
        }
    }
}
