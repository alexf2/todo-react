class SimpleExpressServer {
    private userRepository?: IUserRepository;
    private groupRepository?: IGroupRepository;
    private userService?: IUserService;
    private groupService?: IGroupService;
    private userLogger?: Logger; // логгер для UserService
    private groupLogger?: Logger; // логгер для GroupService
    private module5CallInfoLogger?: Logger; // логгер для отображения информации о вызове REST API
    private authLogger?: Logger;
    private httpServer?: http.Server;
    private isShuttingdown = false;

    constructor(
        private ip: string,
        private port: number,
        private logger: Logger,
        private app: Application = express()) {

        // решил использовать joi-express, а он умеет разбирать параметры querystring и кастить их типы по схеме,
        // поэтому этот парсер уже не нужен
        // app.set('query parser', queryString => new URLSearchParams(queryString));

        this.logger.info('Server is being initialized...');
    }
}
