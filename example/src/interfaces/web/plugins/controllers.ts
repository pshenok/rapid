import {Express} from 'express';
import {AwilixContainer} from 'awilix';
import {processControllers} from './controllers-helper';
import {registerSwagger} from './swagger-helper';

/* Controllers */
import {PingController} from '../controllers/PingController';
import {ProbeController} from '../controllers/ProbeController';
import {ExampleController} from '../controllers/ExampleController';


export function registerControllers (app: Express, container: AwilixContainer): void {
	app.locals.controllers = [
		container.build(ProbeController),
		container.build(PingController),
		container.build(ExampleController),
	];

	processControllers(app);
	registerSwagger(app);
}
