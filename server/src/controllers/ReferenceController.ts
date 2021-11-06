import * as core from 'express-serve-static-core';
import {NextFunction, Request, Response, Router} from 'express';
import {URLSearchParams} from 'url';
import {PriorityModel, DomainAreaModel} from '../models/todos';
import {ControllerBase} from './ControllerBase';
import {Logger, getRequestIdMeta, safeAsyncHandler, parseBool} from '../helpers';
import {BASE_URL} from './const';

interface RefRequest<
    Locals extends Record<string, any> = Record<string, any>
> extends Request<core.ParamsDictionary, any, any, URLSearchParams, Locals> {};

const getArchiveFilter = (includeArchived: string|null) => parseBool(includeArchived) ? {} : {deactivatedOn: {$exists: false}};

export class ReferenceController extends ControllerBase {
    constructor(logger: Logger) {
        super(BASE_URL, logger);
    }

    /**
     * @example GET api/domainAreas?archived=true
     */
    public readonly getDomainAreas = safeAsyncHandler(async (req: RefRequest, res: Response, next: NextFunction) => {
        this.logger.debug('getDomainAreas called', getRequestIdMeta(req));

        res.json(await DomainAreaModel.find(getArchiveFilter(req.query.get('archived'))).sort('name').lean());
    });

    /**
     * @example GET api/priorities?archived=true
     */
    public readonly getPriorities = safeAsyncHandler(async (req: RefRequest, res: Response) => {
        this.logger.debug('getPriorities called', getRequestIdMeta(req));

        res.json(await PriorityModel.find(getArchiveFilter(req.query.get('archived'))).sort('name').lean());
    });

    protected readonly installRoutes = (router: Router) => {
        router
            .get('/domainAreas', this.getDomainAreas)
            .get('/priorities', this.getPriorities);

        this.logger.debug(`Route GET ${this.makePath('domainAreas')} added`);
        this.logger.debug(`Route GET ${this.makePath('priorities')} added`);
    };
}
