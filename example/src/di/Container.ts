import "reflect-metadata";
import { asClass, asValue, AwilixContainer, createContainer, InjectionMode } from "awilix";
import { App } from "../app/App";
import { Logger } from "../app/Logger";
import { Config } from "../app/Config";
import { Web } from "../interfaces/web/Web";
import { DogService } from "../domain/dog/DogService";
import { DogRepository } from "../infra/db/repositories/DogRepository";
import { Db } from "../infra/db/Db";

export class Container {
	public static create(): AwilixContainer {
		const container = createContainer({
			injectionMode: InjectionMode.CLASSIC
		});

		container.register({
			container: asValue(container),

			// App
			app: asClass(App).singleton(),
			config: asClass(Config).singleton(),
			logger: asClass(Logger).singleton(),

			// Domain
			dogService: asClass(DogService).singleton(),

			// Interfaces
			web: asClass(Web).singleton(),

			// Infra
			db: asClass(Db).singleton(),
			dogRepository: asClass(DogRepository).singleton()
		});

		return container;
	}

	private constructor() {
		// do nothing
	}
}
