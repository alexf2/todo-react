import {SimpleExpressServer} from './server';
import {Config, loggers} from './helpers';

new SimpleExpressServer(Config.ip, Config.port, loggers.Core).run();
