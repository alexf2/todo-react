import * as core from 'express-serve-static-core';
import {Application, Request} from 'express';
import {URLSearchParams} from 'url';

export interface IController {
    readonly install: (app: Application) => void;
    isInstalled: boolean;
};

export interface ParcedRequest extends Request<core.ParamsDictionary, any, any, URLSearchParams, Record<string, any>> {};
