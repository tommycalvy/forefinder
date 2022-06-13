//import adapter from '@sveltejs/adapter-auto';
import { adapter } from '../adapter/dist/index.js'
import preprocess from 'svelte-preprocess';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		//adapter: adapter(),
		adapter: adapter({
			cdkProjectPath: '../aws-cdk'
		}),

		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		}
	}
};

export default config;
