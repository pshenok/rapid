import { Express, Request, Response } from "express";
import { WebError } from "../WebError";

export function registerErrorHandler(app: Express): void {
	// It is need to be the last middleware !!!

	app.use((req, res, next) => {
		// 404
		return next(new WebError(404));
	});

	app.use((err: Error, req: Request, res: Response, next: () => void) => {
		let webError: WebError;

		if (err instanceof WebError) {
			app.locals.logger.warn(err.toString());
			webError = err;
		} else if (err.name === "PayloadTooLargeError") {
			webError = new WebError(413);
		} else {
			webError = WebError.from(err);
		}

		const errData = webError.toJSON();

		const statusCode = Number(errData.statusCode) || 500;

		if (statusCode >= 500) {
			app.locals.logger.error(webError);
		}

		res.status(statusCode);

		res.send({
			statusCode: errData.statusCode,
			error: errData.error,
			message: errData.message,
			details: errData.details
		});
	});
}
