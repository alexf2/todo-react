import * as path from 'path';
import {config, getInitialized, initilaizeConfig} from '../appConfig';

const validateConfig = () => {
    if (getInitialized()) {
        return;
    }
    // throw new Error('Конфигурация должна быть проинициализирована вызовом initilaizeConfig при старте приложения');
    initilaizeConfig(); // ленивая инициализация
}

/**
 * Хэлперы для получения конфигурации.
 */
export class Config {
    static get env() { 
        validateConfig();
        return config.get('env');
    }

    // data
    static get connectionString() {
        validateConfig();
        return config.get('data.connectionString')
    }
    static get user() {
        validateConfig();
        return config.get('data.user')
    }
    static get db() {
        validateConfig();
        return config.get('data.db')
    }
    static get password() {
        validateConfig();
        return config.get('data.password')
    }

    // server
    static get ip() {
        validateConfig();
        return config.get('server.ip')
    }
    static get port() {
        validateConfig();
        return config.get('server.port')
    }
    static get reqIdHeader() {
        validateConfig();
        return config.get('server.reqIdHeader')
    }

    // logging
    static get logLevel() {
        validateConfig();
        return config.get('logger.level')
    }
    static get logTransport() {
        validateConfig();
        return config.get('logger.transport')
    }
    static get logFormat() {
        validateConfig();
        return config.get('logger.format')
    }
}

export const getOutFilePath = filePath => {
    const {ext, base, ...rest} = path.parse(filePath);
    return path.format({...rest, ext: '.json'});
};

