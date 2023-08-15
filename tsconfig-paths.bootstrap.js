import { compilerOptions } from './tsconfig.json';
import { register } from 'tsconfig-paths';

const baseUrl = './dist';
const cleanup = register({
    baseUrl,
    paths: compilerOptions.paths,
});

cleanup();
