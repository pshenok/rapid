import uuid from 'uuid';

export class Dog {
	public id: string;
	public name: string;
	public breed: string;

	constructor (init: Partial<Dog>) {
		this.id = init.id || uuid.v4();
		this.name = init.name!;
		this.breed = init.breed!;
	}
}
