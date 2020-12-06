import {Express, Response} from 'express';
import stringify from 'json-stringify-safe';
import {Logger} from '../../../app/Logger';


export function registerLogger (app: Express): void {
	const prefix = Math.random().toString(36).toUpperCase().substr(-4);
	let counter = 0;

	// Register logger for every request
	app.use((req: any, res: Response, next: () => void) => {
		const logger: Logger = app.locals.logger;

		counter += 1;
		const count = counter.toString(36).toUpperCase().padStart(6, '0');
		req.id = `${prefix}_${count}`;
		req.createdAt = req.createdAt || Date.now();

		res.setHeader('X-Trace-Id', req.id);

		logger.traceLogsWith(req.id, () => {
			const doLog = !req.path.startsWith('/_probe/');

			if (!doLog) {
				return next();
			}

			logger.info('Request <<<', {
				method: req.method,
				path:   req.path,
			});

			logger.debug('Request data:', {
				query:   stringify(req.query),
				params:  stringify(req.params),
				rawBody: String(stringify(req.rawBody)).substr(0, 1000),
				body:    String(stringify(req.body)).substr(0, 1000),
				headers: String(stringify(req.headers)).substr(0, 1000),
			});

			res.on('finish', () => {
				if (res.statusCode >= 500) {
					logger.error('Response >>>', {
						method:        req.method,
						path:          req.path,
						result:        'FAIL',
						statusCode:    res.statusCode,
						contentLength: res.getHeader('content-length') || 0,
						duration:      Date.now() - req.createdAt,
					});
				} else if (res.statusCode >= 400) {
					logger.warn('Response >>>', {
						method:        req.method,
						path:          req.path,
						result:        'ERROR',
						statusCode:    res.statusCode,
						contentLength: res.getHeader('content-length') || 0,
						duration:      Date.now() - req.createdAt,
					});
				} else {
					logger.info('Response >>>', {
						method:        req.method,
						path:          req.path,
						result:        'OK',
						statusCode:    res.statusCode,
						contentLength: res.getHeader('content-length') || 0,
						duration:      Date.now() - req.createdAt,
					});
				}
			});

			return next();
		});
	});
}
