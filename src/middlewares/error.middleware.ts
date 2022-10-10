import { NextFunction, Request, Response } from "express";
import { Express } from "express-serve-static-core";

import { logger } from "../config/logger";

export default class ErrorMiddleware {

    constructor(http: Express) {
        this.errorMiddleware(http);
    }

    private errorMiddleware(http: Express) {
        /**
         * Catch all not found route.
         * See this https://stackoverflow.com/questions/11500204/how-can-i-get-express-js-to-404-only-on-missing-routes.
         */
        http.use("*", (request: Request, response: Response, next: NextFunction) => {
            const message = `Requested route [${request.baseUrl}] not found.`;
            const information = {
                http: {
                    method: request.method,
                    url: request.originalUrl,
                    host: request.hostname,
                    ip: request.ip,
                    headers: request.headers,
                    code: 404
                },
            };

            response.status(information.http.code).send({ message });
            logger.warn(message, information);

            next(); // call next middleware
        });

        /**
         * Handle all errors, log it and send response.
         */
        http.use((error: Error, request: Request, response: Response, next: NextFunction) => {
            const message = "Server side error. Please contact team support.";
            const information = {
                http: {
                    method: request.method,
                    url: request.originalUrl,
                    host: request.hostname,
                    ip: request.ip,
                    headers: request.headers,
                    code: 500
                },
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                }
            };

            /**
             * HTTP response sent.
             */
            response.status(information.http.code).send({
                message: message,
                error: error.message,
            });
            logger.error(message, information);

            next(); // call next middleware
        });
    }
}
