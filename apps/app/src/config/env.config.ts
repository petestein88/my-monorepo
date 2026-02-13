const env = (import.meta as any).env

const ENV_CONFIG = {
    URL_PREFIX: env.VITE_URL_PREFIX ?? '',
    VITE_APP_SECRET_KEY: env.VITE_APP_SECRET_KEY,
    BACKEND_APP_URL: env.VITE_BACKEND_APP_URL
}

export { ENV_CONFIG }
