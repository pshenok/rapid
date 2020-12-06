import {Container} from './di/Container';
import {App} from './app/App';

(async () => {
	const container = Container.create();

	const app: App = container.cradle.app;

	setImmediate(async () => {
		await app.init();
		await app.start();
	});


	/**
	 * NODE ERROR HANDLERS
	 */
	process.on('uncaughtException', async (err) => {
		try {
			await app.stop(['UNCAUGHT EXCEPTION', String(err)]);
		} finally {
			process.exit(1);
		}
	});

	process.on('unhandledRejection', async (err) => {
		try {
			await app.stop(['UNHANDLED REJECTION', String(err)]);
		} finally {
			process.exit(1);
		}
	});


	process.on('SIGTERM', async () => {
		await gracefulShutdown('SIGTERM');
	});
	process.on('SIGINT', async () => {
		await gracefulShutdown('SIGINT');
	});
	process.on('SIGHUP', async () => {
		await gracefulShutdown('SIGHUP');
	});

	async function gracefulShutdown (signal: string): Promise<void> {
		try {
			setTimeout(() => {
				process.exit(2);
			}, 10000);

			await app.stop([`SIGNAL ${signal}`, 'Graceful shutdown']);
		} finally {
			process.exit(1);
		}

		process.exit(0);
	}
})();
