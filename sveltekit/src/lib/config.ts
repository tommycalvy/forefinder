type SecurityMode = 'cookie' | 'jwt';

const baseUrl = import.meta.env.VITE_BASE_URL || '/';

const securityMode: SecurityMode = import.meta.env.VITE_SECURITY_MODE || 'cookie';
const browserUrl = import.meta.env.VITE_KRATOS_BROWSER_URL || 'http://localhost:3000';
const publicUrl = import.meta.env.VITE_KRATOS_PUBLIC_URL;
const adminUrl = import.meta.env.VITE_KRATOS_ADMIN_URL;
const jwksUrl = import.meta.env.VITE_JWKS_URL || '/';
const projectName = 'Sveltekit Kratos';

export default {
	kratos: {
		browser: browserUrl,
		admin: adminUrl,
		public: publicUrl
	},
	baseUrl,
	jwksUrl,
	projectName,
	securityMode
};