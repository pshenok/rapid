import {Db} from '../Db';
import {Dog} from '../../../domain/dog/Dog';
import {DogModel} from '../models/DogModel';
import { IDogRepository, IFindDogInput } from '../../../domain/dog/IDogRepository';
import { Op } from 'sequelize';
import { IListStructure } from '../../../domain/domain.types';

export class DogRepository implements IDogRepository {

	constructor (private db: Db) {}

	public async create (dogData: Dog): Promise<Dog> {
		const dog = DogModel.fromEntity(dogData);

		await dog.save();

		return dog.toEntity();
	}

	public async list (input: IFindDogInput): Promise<IListStructure<Dog>> {
		const where = this.generateWhereFromInput(input);
		const dogs = await this.db.models.Dog.findAll({ where });

		return {
			total: dogs.length,
			items: dogs
		};
	}

	public async get (input: IFindDogInput): Promise<Dog | null> {
		const where = this.generateWhereFromInput(input);
		const dog = await this.db.models.Dog.findOne({ where });

		return dog ? dog.toEntity() : null;
	}

	private generateWhereFromInput (input: IFindDogInput): any {
		const where: any = {};
		if (input.id) {
			Object.assign(where, {
				id: input.id,
			});
			return where;
		}
		if (input.name) {
			Object.assign(where, {
				name: { [Op.iLike]: `%${input.name}%` }
			});
		}
		if (input.breed) {
			Object.assign(where, {
				breed: { [Op.iLike]: `%${input.breed}%` }
			});
		}
		return where;
	}

}
