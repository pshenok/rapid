import { Dog } from "./Dog";
import { IListStructure } from "../domain.types";

export interface IFindDogInput {
	id?: string;
	name?: string;
	breed?: string;
}

export interface IDogRepository {
	create(dogData: Dog): Promise<Dog>;
	get(input: IFindDogInput): Promise<Dog | null>;
	list(input: IFindDogInput): Promise<IListStructure<Dog>>;
}
