import convict from 'convict';
import {ipaddress} from 'convict-format-with-validator';
// Для загрузки build-specific конфига используем синхронную версию
import {existsSync} from 'fs';
import * as path from 'path';

convict.addFormat(ipaddress);

const configuration = {
    env: {
        doc: 'The applicaton environment.',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV',
    },

    data: {
        connectionString: {
            doc: 'Mongo connection string',
            format: String,
            default: '',
        },
        user: {
            doc: 'Mongo DB user',
            format: String,
            default: undefined,
        },
        password: {
            doc: 'Mongo DB password',
            format: String,
            default: undefined,
        },
        db: {
            doc: 'Mongo database name',
            format: String,
            default: undefined,
        },
    },
    
    server: {
        ip: {
            doc: 'The IP address to bind.',
            format: 'ipaddress',
            default: '127.0.0.1',
            env: 'IP_ADDRESS',
        },
        port: {
            doc: 'The port to bind.',
            format: 'port',
            default: 5000,
            env: 'PORT',
        },
        reqIdHeader: {
            doc: 'The header where request ID is',
            format: String,
            default: 'api-request-id',
            env: 'REQUEST_ID_HEADER',
        },
    },

    logger: {
        level: {
            doc: 'Logging level',
            level: ['error', 'warn', 'info', 'http', 'verbose', 'debug'],
            default: 'debug',
            env: 'LOG_LEVEL',
        },
        transport: {
            doc: 'Log output',
            transport: ['Console', 'File'],
            default: 'Console',
        },
        format: {
            doc: 'Log format',
            format: ['Simple', 'Json'],
            default: 'Simple',
        },
    },
};

export type ConfigType = typeof configuration;

// Тут описываем мету для нашего конфига со значениями по-умолчанию.
// Для каждой разновидности билда/запуска (test, production, development) в отдельной корневой папке проекта подкладывается частичный config,
// который переопределяет только нужные параметры конфигурации.
export const config = convict(configuration);

let isInitialized: boolean;

/**
 * Необходимо выполнить перед использование конфигурации.
 */
export const initilaizeConfig = () => {
    if (!isInitialized) {
        isInitialized = true;
        const configFile = path.join(process.cwd(), 'config', `${config.get('env')}.json`);

        if (existsSync(configFile)) {
            config
                .loadFile(configFile) // вмёрживаем специфическую конфигурацию
                .validate({allowed: 'strict'});
        }
    }
}

export const getInitialized = () => isInitialized;
