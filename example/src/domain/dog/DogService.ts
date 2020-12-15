import { IDogRepository, IFindDogInput } from './IDogRepository';
import { Dog } from './Dog';
import { IListStructure } from '../domain.types';
import { AppError } from '../../app/AppError';

export class DogService {
	constructor (private dogRepository: IDogRepository) {}

	public async createDog (dogData: Partial<Dog>): Promise<Dog> {
		return this.dogRepository.create(new Dog(dogData));
	}

	public async getDog (input: IFindDogInput): Promise<Dog> {

		const dog = await this.dogRepository.get(input);
		console.log(`--------------------------------`, dog);
		if (!dog) {
			throw new AppError('WRONG INPUT', 'Dog not found');
		}

		return dog;
	}

	public async listDogs (input: IFindDogInput): Promise<IListStructure<Dog>> {
		return this.dogRepository.list(input);
	}
}
