const mapPrivateData = (data: any) => {
    const {error, ...rest} = data || {};
    if (error instanceof Error) {
        return {
            ...rest,
            name: error.name,
            message: error.message,
            stack: error.stack,
        }
    }
    return data;
}

export class CustomError extends Error
{
    protected publicData: any;
    protected privateData: any;

    constructor(msg: string) {
        super(msg);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

    public readonly getHttpCode = () => 500;

    public readonly mapToHttpResponse = () => ({
        code: this.getHttpCode(),
        name: this.name,
        message: this.message,
        data: this.publicData,
    });

    public readonly mapToServerLog = () => ({
        ...this.mapToHttpResponse(),
        ...mapPrivateData(this.privateData),
    });
}

export class NotFoundError extends CustomError {
    constructor(entity: string, idValue: string, idName = 'id') {
        super(`${entity} ${idName} = ${idValue} is not found`);

        this.publicData = {[idName]: idValue};
        this.privateData = {stack: this.stack};
    }
    public readonly getHttpCode = () => 404;
}

export class UnauthorizedError extends CustomError {
    constructor(subject: string, login: string) {
        // если subject пустой, то в login лежит полное сообщение, которое сформировал клиент
        super(subject ? `Bad ${subject} for '${login}'` : login);

        this.publicData = {login};
        this.privateData = {stack: this.stack};
    }
    public readonly getHttpCode = () => 401;
}

export class UnauthorizedLoginError extends UnauthorizedError {
    constructor(login: string) {
        super('login', login);
    }
}

export class UnauthorizedPwdError extends UnauthorizedError {
    constructor(login: string) {
        super('password', login);
    }
}

export class GenericUnauthorizedPwdError extends UnauthorizedError {
    constructor(msg: string) {
        super('', msg);
    }
}

export class BadRequestError extends CustomError {
    constructor(action: string, summary: string, params: any) {
        super(`Invalid parameters at [${action}]: ${summary}`);

        this.publicData = {...params};
        this.privateData = {stack: this.stack};
    }
    public readonly getHttpCode = () => 400;
}

export class GenericForbiddenError extends CustomError {
    constructor(msg: string) {
        super(msg);

        this.publicData = {};
        this.privateData = {stack: this.stack};
    }
    public readonly getHttpCode = () => 403;
}

export class InternalServerError extends CustomError {
    constructor(error: Error, action?: string) {
        super(action ? `${action}: error.message` : error.message);

        this.privateData = {error};
    }
}

// https://rclayton.silvrback.com/custom-errors-in-node-js
