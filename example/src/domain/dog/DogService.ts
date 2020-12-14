import { IDogRepository, IFindDogInput } from './IDogRepository';
import { Dog } from './Dog';
import { IListStructure } from '../domain.types';

export class DogService {
	constructor (private dogRepository: IDogRepository) {}

	public async createDog (dogData: Partial<Dog>): Promise<Dog> {
		return this.dogRepository.create(new Dog(dogData));
	}

	public async getDog (input: IFindDogInput): Promise<Dog | null> {
		return this.dogRepository.get(input);
	}

	public async listDogs (input: IFindDogInput): Promise<IListStructure<Dog>> {
		return this.dogRepository.list(input);
	}
}