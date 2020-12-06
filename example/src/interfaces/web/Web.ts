import express from 'express';
import http from 'http';
import {AddressInfo} from 'net';
import helmet from 'helmet';
import cors from 'cors';
import {Express, Request} from 'express';
import {AwilixContainer} from 'awilix';
import {IInterface} from '../interfaces.types';
import {Config} from '../../app/Config';
import {Logger} from '../../app/Logger';
import {registerLogger} from './middlewares/logger';
import {registerErrorHandler} from './middlewares/error-handler';
import {registerControllers} from './plugins/controllers';


export class Web implements IInterface {
	private readonly app: Express;
	private server!: http.Server;

	constructor (
		private logger: Logger,
		private config: Config,
		private container: AwilixContainer,
	) {
		this.app = express();
	}

	public async init (): Promise<void> {
		this.app.locals.logger = this.logger;
		this.app.locals.config = this.config;
		this.app.locals.container = this.container;

		this.app.use(helmet());
		this.app.set('trust proxy', true);

		registerLogger(this.app);

		const origins = this.config.web.corsOrigin.split(';').map((it) => {
			return it.trim();
		});
		this.app.use(cors({
			origin:      origins.length === 1 ? origins[0] : origins,
			credentials: true,
		}));
		this.app.use(express.json({
			limit:  this.config.web.bodyLimit,
			verify: (req: Request, res: any, buf: Buffer, encoding: string) => {
				req.rawBody = buf;
			}
		}));
		this.app.use(express.urlencoded({ extended: true }));

		const scope = this.container.createScope();
		registerControllers(this.app, scope);
		registerErrorHandler(this.app);
	}

	public async start (): Promise<void> {
		await new Promise((resolve, reject) => {
			this.logger.info(`web: starting ${this.config.web.port}`);

			this.server = this.app
			.listen(this.config.web.port)
			.on('listening', () => {
				const address = this.server.address() as AddressInfo;

				this.logger.info(`web: stared http://localhost:${address.port}`);

				return resolve();
			})
			.on('error', (err) => {
				this.logger.error('web: failed');

				return reject(err);
			});
		});
	}

	public async stop (): Promise<void> {
		if (this.server) {
			this.logger.info('web: closing');
			this.server.close();
			this.logger.info('web: closed');
		}
	}

	public getPort (): number {
		const address = this.server.address() as AddressInfo;

		if (address) {
			return address.port;
		} else {
			return 0;
		}
	}
}
