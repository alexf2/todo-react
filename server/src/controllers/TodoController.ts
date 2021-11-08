import * as core from 'express-serve-static-core';
// preffered using v5 and moving the project to ESM: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c,
// https://github.com/TypeStrong/ts-node/issues/1007
import {NextFunction, Response, Router} from 'express';
import {Query} from 'mongoose';
import {TodoModel, addCalculatedTodo, addCalculatedTodos, addCalculatedTodosGroup} from '../models/todos';
import {ControllerBase} from './ControllerBase';
import {Logger, getRequestIdMeta, safeAsyncHandler, parseBool} from '../helpers';
import {BASE_URL} from './const';
import {ParcedRequest} from './controllers.types';
import {getTodoFilter, getOrdering, getGrouping, getGroupSortingSign, getGroupSortingField} from './todoHelpers';

const populateTodoRefs = <X, Y>(q: Query<X, Y>) => q.populate('priority domainArea', 'name code');
export class TodoController extends ControllerBase {
    constructor(logger: Logger) {
        super(BASE_URL, logger);
    }

    // grouping: none, domain, priority
    // ordering: priority, dueDate, priority + dueDate, createdAt, finishedOn
    // filtering by: descrition, archive (show all, including archive), onlyArchive
    /**
     * @example GET api/todos?grouping=doamin&order=priority&searchDescr=xxx
     */
    public readonly getAll = safeAsyncHandler(async (req: ParcedRequest, res: Response, next: NextFunction) => {
        this.logger.debug('getAll called', getRequestIdMeta(req));

        const {query} = req;
        const grouping = query.get('grouping');
        const ordering = getOrdering(query.get('order'));
        const filteringByDescr = query.get('searchDescr');
        const showArchived = parseBool(query.get('showArchived'));
        const onlyArchived = parseBool(query.get('onlyArchived'));
        
        let todos;
        const filter = getTodoFilter(filteringByDescr, showArchived, onlyArchived);

        if (grouping) {
            const pipeline: any[] = [];
            const groupField = getGrouping(grouping);

            filter && pipeline.push({$match: filter});
            pipeline.push({$lookup: {from: 'priorities', localField: 'priority', foreignField: '_id', as: 'priority'}});
            pipeline.push({$lookup: {from: 'domainAreas', localField: 'domainArea', foreignField: '_id', as: 'domainArea'}});
            ordering && pipeline.push({$sort: ordering}); /// sorting each group inside
            pipeline.push(
                {$group: {
                    '_id': {
                        code: `$${groupField}.code`,
                        name: `$${groupField}.name`,
                    },
                    count: {$sum: 1},
                    items: {
                        $push: '$$ROOT',
                    },
                }});
            pipeline.push({$unset: ['items.priority.__v', 'items.priority.createdAt', 'items.priority.updatedAt']});
            pipeline.push({$unset: ['items.domainArea.__v', 'items.domainArea.createdAt', 'items.domainArea.updatedAt']});
            pipeline.push({$sort: {[`_id.${getGroupSortingField(grouping)}`]: getGroupSortingSign(grouping)}}); // sorting groups by _id

            todos = TodoModel.aggregate(pipeline);
        } else {
            const pipeline: any[] = [];

            filter && pipeline.push({$match: filter});
            pipeline.push({$lookup: {from: 'priorities', localField: 'priority', foreignField: '_id', as: 'priority'}});
            pipeline.push({$lookup: {from: 'domainAreas', localField: 'domainArea', foreignField: '_id', as: 'domainArea'}});
            pipeline.push({$unwind: '$priority'});
            pipeline.push({$unwind: '$domainArea'});
            pipeline.push({$unset: ['priority.__v', 'priority.createdAt', 'priority.updatedAt']});
            pipeline.push({$unset: ['domainArea.__v', 'domainArea.createdAt', 'domainArea.updatedAt']});
            ordering && pipeline.push({$sort: ordering});

            todos = TodoModel.aggregate(pipeline);
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
        const todo = await populateTodoRefs(TodoModel.findById(id)).lean();

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

        const result = await populateTodoRefs(TodoModel.findByIdAndUpdate(id, body, {new: true})).lean();

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
        const result = await populateTodoRefs(TodoModel.findByIdAndRemove(id)).lean();

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
            .patch('/todos/:id', this.patch)
            .delete('/todos/:id', this.delete);

        this.logger.debug(`Route GET ${this.makePath('todos')} added`);
        this.logger.debug(`Route GET ${this.makePath('todos/:id')} added`);
    }
}
