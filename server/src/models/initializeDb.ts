import {connection} from 'mongoose';
import {TodoModel, PriorityModel, DomainAreaModel, DomainArea, Priority} from './todos';
import {Logger} from '../helpers';
import {priorities as prioritiesData, area as areaData, getTodos} from './data';

const collections = [TodoModel.modelName, PriorityModel.modelName, DomainAreaModel.modelName];

const saveRemoveCollection = async (logger: Logger, docs: string[]) => {
    for (const n of docs) {
        try {
            const len = await connection.collection(n).countDocuments();
            if (len > 0) {
                // await connection.dropCollection(n);
                await connection.collection(n).deleteMany({});
                logger.info(`${n}: cleared`);
            }
        } catch (err) {
            if ((err as any).code === 26) {
                logger.info(`${n} - does not exist`);
            } else {
                throw err;
            }
        }
    }
}
const saveCreateCollections = async (logger: Logger, docs: string[]) => {
    for (const n of docs) {
        const info = await connection.db.listCollections({name: n});
        if (!info) {
            await connection.createCollection(n);
            logger.info(`${n}: created`);
        }
    }
}

const clearData = async (logger: Logger) => saveRemoveCollection(logger, collections);
const createCollections = async (logger: Logger) => saveCreateCollections(logger, collections);

const populateRefs = async (logger: Logger) => {
    const priorities =
        await PriorityModel.insertMany(prioritiesData);

    const domainArea = await DomainAreaModel.insertMany(areaData);

    logger.info(`Refs populated: ${priorities.length}, ${domainArea.length}`);

    return {priorities, domainArea};
}

const populateTodos = async (logger: Logger, p: Priority[], da: DomainArea[]) => {
    const result = await Promise.all(getTodos(p, da).map(item => TodoModel.create(item)));
    logger.info(`Todos populated ${result.length}`);
}

export const iniDb = async (logger: Logger) => {
    await clearData(logger);
    const {priorities, domainArea} = await populateRefs(logger);
    await populateTodos(logger, priorities, domainArea);
    // await createCollections(logger);
    logger.info('Db has been initialized');
}

