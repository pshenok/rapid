import { Express, Request, Response, Router } from "express";
import joi from "../../../app/Validator";
import fs from "fs";
import { WebError } from "../WebError";
import { IHandlerData } from "../decorators";

export function processControllers(app: Express): void {
	app.locals.controllers.forEach((controller: any) => {
		const router = Router();

		const pathPrefix = controller.pathPrefix || "/";

		Object.getOwnPropertyNames(Object.getPrototypeOf(controller)).forEach(handlerName => {
			const handler = controller[handlerName];

			const handlerData: IHandlerData = Reflect.getMetadata("handler:data", controller, handlerName);

			if (!handlerData) {
				return;
			}

			app.locals.logger.info(`Route ${handlerData.method} ${pathPrefix} ${handlerData.path} - ${handlerData.description}`);

			const method = handlerData.method.toLowerCase();
			const path = handlerData.path;

			handlerData.handler = handler.bind(controller);
			handlerData.processReq = processReq(handlerData);

			validate(app, handlerData);
			(router as any)[method](path, wrap(app, handlerData));
		});

		app.use(pathPrefix, router);
	});
}

const KEYS_FOR_VALIDATION = ["query", "body", "params", "headers"];
const VALIDATION_OPTIONS = {
	abortEarly: false,
	allowUnknown: false
};

const handlerSchema = joi.object().keys({
	description: joi.string().required(),
	method: joi.string().required(),
	path: joi.string().required(),
	validate: joi.object().required(),
	handler: joi.func().required(),
	processReq: joi.func(),
	response: joi.object().required(),
	options: joi.object()
});

function validate(app: Express, handlerData: any): void {
	const result = joi.validate(handlerData, handlerSchema);

	if (result.error) {
		app.locals.logger.fatal("Error on handler validation");
		throw result.error;
	}
}

function processReq(handlerData: IHandlerData) {
	return async function(req: any, res: any): Promise<any> {
		if (handlerData.validate) {
			KEYS_FOR_VALIDATION.forEach(key => {
				const schema = (handlerData.validate as any)[key];

				if (!schema) {
					return (req[key] = {});
				}

				const validationResult = joi.validate(req[key], schema, VALIDATION_OPTIONS);
				req[key] = validationResult.value;

				if (validationResult.error) {
					const details = {
						in: key,
						errors: (validationResult.error.details || []).map((it: any) => {
							return {
								message: it.message,
								key: (it.context || {}).key,
								value: (it.context || {}).value
							};
						})
					};
					throw new WebError(400, "VALIDATION ERROR", `Request validation failed in ${key}`, details);
				}
			});
		}

		return handlerData.handler!(req, res);
	};
}

function wrap(app: Express, handlerData: IHandlerData) {
	return async function(req: Request, res: Response, next: (err?: Error) => void): Promise<Response | void> {
		try {
			const data = await handlerData.processReq!(req, res);

			if (res.headersSent) {
				return res;
			}

			if (handlerData.options && handlerData.options.sendFile) {
				if (data.filePath) {
					app.locals.logger.info(`Sending file ${data.filePath}`);

					return res.status(200).sendFile(data.filePath, err => {
						if (err) {
							app.locals.logger.warn(`Sending file ${data.filePath} failed: ${err.toString()}`);
						} else {
							app.locals.logger.info(`Sending file ${data.filePath} completed`);
						}

						if (handlerData.options!.deleteAfterSend) {
							app.locals.logger.info(`Deleting file ${data.filePath}`);
							fs.unlink(data.filePath, fsErr => {
								if (fsErr) {
									app.locals.logger.warn(`Deleting file ${data.filePath} failed ${fsErr.toString()}`);
								} else {
									app.locals.logger.info(`Deleting file ${data.filePath} completed`);
								}
							});
						}
					});
				} else {
					return res.status(404).send(new WebError(404, "FILE NOT FOUND", "No file to send"));
				}
			} else {
				return res.status(200).send({
					data: data
				});
			}
		} catch (err) {
			return next(err);
		}
	};
}
