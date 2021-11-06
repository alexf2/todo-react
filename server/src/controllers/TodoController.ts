import * as core from 'express-serve-static-core';
// preffered using v5 and moving the project to ESM: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c,
// https://github.com/TypeStrong/ts-node/issues/1007
import {NextFunction, Response, Router} from 'express';
import {TodoModel, addCalculatedTodo, addCalculatedTodos, addCalculatedTodosGroup} from '../models/todos';
import {ControllerBase} from './ControllerBase';
import {Logger, getRequestIdMeta, safeAsyncHandler, parseBool} from '../helpers';
import {BASE_URL} from './const';
import {ParcedRequest} from './controllers.types';
import {getTodoFilter, getOrdering, getGrouping} from './todoHelpers';

export class TodoController extends ControllerBase {
    constructor(logger: Logger) {
        super(BASE_URL, logger);
    }

    // grouping: none, domain, priority
    // ordering: priority, dueDate, priority + dueDate, createdAt, finishedOn
    // filtering by: descrition, archive
    /**
     * @example GET api/todos
     */
    public readonly getAll = safeAsyncHandler(async (req: ParcedRequest, res: Response, next: NextFunction) => {
        this.logger.debug('getAll called', getRequestIdMeta(req));

        const {query} = req;
        const grouping = query.get('grouping');
        const ordering = query.get('order');
        const filteringByDescr = query.get('searchDescr');
        const showArchived = parseBool(query.get('showArchived'));
        
        let todos;
        const filter = getTodoFilter(filteringByDescr, showArchived);

        if (grouping) {
            const pipeline: any[] = [];
            const groupField = getGrouping(grouping);

            filter && pipeline.push({$match: filter});
            ordering && pipeline.push({$sort: ordering});
            pipeline.push({$lookup: {from: 'priorities', localField: 'priority', foreignField: '_id', as: 'priority'}});
            pipeline.push({$lookup: {from: 'domainAreas', localField: 'domainArea', foreignField: '_id', as: 'domainArea'}});
            pipeline.push({$group: {
                '_id': {value: `$${groupField}`},
                count: {$sum: 1},
                items: {$push: '$$ROOT'},
            }});

            todos = TodoModel.aggregate(pipeline);
        } else {
            todos = TodoModel.find(filter || {}).populate('priority').populate('domainArea').lean();
            if (ordering) {
                todos.sort(getOrdering(ordering));
            }
        }

        const items = await todos;

        if (items.length) {
            res.json(grouping ? addCalculatedTodosGroup(items) : addCalculatedTodos(items));
        } else {
            res.sendStatus(204);
        }
    });

    /**
     * @example GET api/todos/:id
     */
    public readonly getById = safeAsyncHandler(async (req: ParcedRequest, res: Response, next: NextFunction) => {
        this.logger.debug('getById called', getRequestIdMeta(req));

        const {id} = req.params;
        const todo = await TodoModel.findById(id).lean();

        if (todo) {
            res.json(addCalculatedTodo(todo));
        } else {
            res.status(404).send(`Todo item '${id}' has not found`);
        }
    });

    /**
     * @example POST api/todos
     */
    public readonly create = safeAsyncHandler(async (req: ParcedRequest, res: Response, next: NextFunction) => {
        this.logger.debug('create called', getRequestIdMeta(req));

        const {body} = req;
        const todoItem = new TodoModel(body);
        await todoItem.save();

        res.status(201).json(todoItem.toObject());
    });

    /**
     * @example PATCH api/todos/:id
     */
    public readonly patch = safeAsyncHandler(async (req: ParcedRequest, res: Response, next: NextFunction) => {
        this.logger.debug('patch called', getRequestIdMeta(req));

        const {id} = req.params;
        const {body} = req;

        const result = await TodoModel.findByIdAndUpdate(id, body).lean();

        if (result) {
            res.json(result);
        } else {
            res.status(404).send(`Todo item '${id}' has not found`);
        }
    });

    /**
     * @example DELETE api/todos/:id
     */
    public readonly delete = safeAsyncHandler(async (req: ParcedRequest, res: Response, next: NextFunction) => {
        this.logger.debug('delete called', getRequestIdMeta(req));

        const {id} = req.params;
        const result = await TodoModel.findByIdAndRemove(id).lean();

        if (result) {
            res.json(result);
        } else {
            res.sendStatus(204);
        }
    });

    protected readonly installRoutes = (router: Router) => {
        router
            .get('/todos', this.getAll)
            .get('/todos/:id', this.getById)
            .post('/todos', this.create)
            .patch('/todos', this.patch)
            .delete('/todos/:id', this.delete);

        this.logger.debug(`Route GET ${this.makePath('todos')} added`);
        this.logger.debug(`Route GET ${this.makePath('todos/:id')} added`);
    }
}
