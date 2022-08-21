const browserUrl = import.meta.env.VITE_KRATOS_BROWSER_URL || 'http://localhost:3000';
const publicUrl = import.meta.env.VITE_KRATOS_PUBLIC_URL;
const adminUrl = import.meta.env.VITE_KRATOS_ADMIN_URL;

export default {
    kratos: {
        browser: browserUrl,
        admin: adminUrl,
        public: publicUrl,
    }
};