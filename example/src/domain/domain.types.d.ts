
export interface IListData {
	skip?: number;
	limit?: number;
}

export interface IListStructure<T> {
	total: number;
	items: T[];
}
