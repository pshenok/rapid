interface ICreateDomainInput {
	projectName: string;
	configPath: string;
	path?: string;
}

export function createDomain({ projectName, configPath, path }: ICreateDomainInput): void {
	
}