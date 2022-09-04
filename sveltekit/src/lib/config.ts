const browserUrl: string = import.meta.env.VITE_KRATOS_BROWSER_URL || 'http://localhost:3000';
const publicUrl: string = import.meta.env.VITE_KRATOS_PUBLIC_URL || 'http://127.0.0.1:4433/';
const adminUrl: string = import.meta.env.VITE_KRATOS_ADMIN_URL;

export default {
    kratos: {
        browser: browserUrl,
        admin: adminUrl,
        public: publicUrl,
    }
};