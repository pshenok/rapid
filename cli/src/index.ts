import { argv } from 'yargs';
import { createBaseProject } from './builders/baseProjectBuilder';


const PROJECT_NAME = argv.pname as any;
const CONFIG_PATH = argv.config as any;
const PROJECT_PATH = argv.path as any;

console.log(`
Project name: ${PROJECT_NAME}
`);

createBaseProject({ 
	projectName: PROJECT_NAME,
	configPath: CONFIG_PATH,
	path: PROJECT_PATH 
});

