import {NextFunction, Request, Response, Router} from 'express';
import {ControllerBase} from './ControllerBase';
import {Logger, getRequestIdMeta} from '../helpers';
import {BASE_URL} from './const';

export class TodoController extends ControllerBase {
    constructor(logger: Logger) {
        super(BASE_URL, logger);
    }

    public readonly getAll = async (req: Request, res: Response, next: NextFunction) => {
        this.logger.debug('getAll called', getRequestIdMeta(req));

        const {query} = req;

        /*const groups = await this.groupService.getAllGroups(query.limit);
        if (!groups || !groups.length) {
            res.status(204);
        }
        res.json(groups);*/
    }

    protected readonly installRoutes = (router: Router) => {
        router
            .get('/todos', this.getAll);

        this.logger.debug(`Route GET ${this.makePath('todos')} added`);
    }

}
