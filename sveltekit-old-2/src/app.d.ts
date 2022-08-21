/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces


	declare namespace App {
		interface Locals {
			session: import('@ory/kratos-client').Session | undefined,
		}
	
		// interface Platform {}
	
		interface Session {
			user: import('$lib/auth').User | undefined,
		}
	
		// interface Stuff {}
	}	

